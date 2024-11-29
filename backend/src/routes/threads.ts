import express from 'express';
const router = express.Router()
import auth from '../util/auth';
import jwt from 'jsonwebtoken';

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
            'select * from threads where id = ?',
            [req.params.id]
        )
        if(threadDetails.length === 0) {
            res.status(404).send('Thread not found')
            return
        }
        try {
            const [posts, fields] = await db.execute(
                'select * from posts where threadId = ? order by createdAt',
                [req.params.id]
            )
            if(posts.length === 0) {
                res.status(404).send('Thread not found')
                return
            }
            res.send({thread: threadDetails[0], posts: posts})
        } catch (err: any) {
            console.error(err)
            res.status(500).send()
        }
    } catch (err: any) {
        console.error(err)
        res.status(500).send()
    }
})

module.exports = router