import express from 'express';
const router = express.Router()
import auth from '../util/auth';
import { JWTPayload } from '../util/auth';

router.post('/:id/addPost', async (req: express.Request, res: express.Response) => {
    if (req.headers.authorization == undefined) {
        res.status(401).send('Unauthorized')
        return
    }
    let user: JWTPayload
    try {
        user = auth.verify(req.headers.authorization, true)
    } catch (err: any) {
        res.status(401).send('Unauthorized')
        return
    }
    // TODO: Really annoying edge case (because of JWT): 
    // if a user changes accountId in between generating a token and creating a post,
    // they are not authorized to post but do so anyways 
    const db = req.app.get('db');
    try {
        const [thread, threadFields] = await db.execute(
            'select 1 from threads where id = ?',
            [req.params.id]
        )
        if (thread.length === 0) {
            res.status(404).send('Thread not found')
            return
        }
        try {
            const [post, postFields] = await db.execute(
                'insert into posts (threadId, authorId, content) values (?, ?, ?)',
                [req.params.id, user.userId, req.body.content]
            )
            res.status(201).send({ id: post.insertId })
            return
        } catch (err: any) {
            console.error(err)
            res.status(500).send()
            return
        }
    } catch (err: any) {
        console.error(err)
        res.status(500).send()
        return
    }
})


router.get('/:id', async (req: express.Request, res: express.Response) => {
    // if (req.headers.authorization == undefined) {
    //     res.status(401).send('Unauthorized')
    //     return
    // }
    // const user = auth.verify(req.headers.authorization, true)
    // res.send(`Correctly authenticated ${JSON.stringify(user)}!`) // TODO: permission locked threads
    const db = req.app.get('db');
    try {
        const [threadDetails, fields] = await db.execute(
            'select * from threads join users on users.id = threads.authorId where threads.id = ?',
            [req.params.id]
        )
        if (threadDetails.length === 0) {
            res.status(404).send('Thread not found')
            return
        }
        try {
            const [posts, fields] = await db.execute(
                'select posts.id, content, createdAt, users.id as userId, users.username, users.displayName, users.registerDate from posts join users on users.id = posts.authorId where threadId = ? order by createdAt',
                [req.params.id]
            )
            if (posts.length === 0) {
                res.status(404).send('Thread not found (no posts?)')
                return
            }
            res.send({ thread: threadDetails[0], posts: posts })
            return
        } catch (err: any) {
            console.error(err)
            res.status(500).send()
            return
        }
    } catch (err: any) {
        console.error(err)
        res.status(500).send()
        return
    }
})

router.get('/', async (req: express.Request, res: express.Response) => {
    const db = req.app.get('db');
    try {
        const [threadDetails, fields] = await db.execute(
            `select threads.id, threads.title, threads.createdAt, users.username, users.displayName, threadtags.name as tag, threadtags.color as tagColor, COUNT(p.threadId) as postCount from threads join users on users.id = threads.authorId left join threadtags on threadtags.id = threads.tagId left join posts p on p.threadId = threads.id GROUP BY p.threadId;`
        )
        if (threadDetails.length === 0) {
            res.status(404).send('No threads?')
            return
        }
        res.send(threadDetails)
        return
    } catch (err: any) {
        console.error(err)
        res.status(500).send()
        return
    }
})

router.post('/:id/edit', async (req: express.Request, res: express.Response) => {
    if (req.headers.authorization == undefined) {
        res.status(401).send('Unauthorized')
        return
    }
    let user: JWTPayload
    try {
        user = auth.verify(req.headers.authorization, true)
    } catch (err: any) {
        res.status(401).send('Unauthorized')
        return
    }
    // TODO: Really annoying edge case (because of JWT), explanation above in /addPost
    const db = req.app.get('db');
    try {
        const [results, fields] = await db.execute(
            `UPDATE threads SET title = ?, tagId = ?, createdAt = createdAt where threads.id = ?;`,
            [req.body.title, req.body.tag === 0 ? null : req.body.tag, req.params.id]
        )
        if (results.length === 0) {
            res.status(404).send('No threads?')
            return
        }
        res.status(200).send()
        return
    } catch (err: any) {
        console.error(err)
        res.status(500).send()
        return
    }
})

router.post('/:id/delete', async (req: express.Request, res: express.Response) => {
    if (req.headers.authorization == undefined) {
        res.status(401).send('Unauthorized')
        return
    }
    let user: JWTPayload
    try {
        user = auth.verify(req.headers.authorization, true)
    } catch (err: any) {
        res.status(401).send('Unauthorized')
        return
    }
    // TODO: Really annoying edge case (because of JWT), explanation above in /addPost
    const db = req.app.get('db');
    try {
        const [results, fields] = await db.execute(
            ` DELETE FROM threads WHERE threads.id = ? and authorId = ?;`,
            [req.params.id, user.userId]
        )
        if (results.length === 0) {
            res.status(500).send({error: 'Could not find a thread created by the user'})
            return
        }
        res.status(200).send()
        return
    } catch (err: any) {
        console.error(err)
        res.status(500).send()
        return
    }
})

router.post('/new', async (req: express.Request, res: express.Response) => {
    if (req.headers.authorization == undefined) {
        res.status(401).send('Unauthorized')
        return
    }
    let user: JWTPayload
    try {
        user = auth.verify(req.headers.authorization, true)
    } catch (err: any) {
        res.status(401).send('Unauthorized')
        return
    }
    // TODO: Really annoying edge case (because of JWT), explanation above in /addPost
    const db = req.app.get('db');
    try {
        await db.beginTransaction() // TODO: IM SHOOTING MYSELF IN THE FOOT AGAIN I DO NOT HAVE TIME TO FIX THIS (it works for the demo so who cares)
        const [threadResults, fields] = await db.execute(
            "insert into threads (authorId, title, tagId) values (?,?,?)",
            [user.userId, req.body.title, req.body.tag == "" ? null : req.body.tag]
        )
        if (threadResults.insertId) {
            const [postResults, fields] = await db.execute(
                "INSERT INTO posts (threadId, authorId, content) values (?,?,?)",
                [threadResults.insertId, user.userId, req.body.content]
            )
            db.commit()
            res.status(201).send({ id: threadResults.insertId })
        } else {
            throw new Error("Thread was not creted")
        }
    } catch (err: any) {
        await db.rollback()
        console.error(err)
        res.status(500).send({ error: 'Interal server error' })
        return
    }
})


module.exports = router