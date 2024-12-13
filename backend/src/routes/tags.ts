import express from 'express';
const router = express.Router()
import auth from '../util/auth';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../util/auth';


// TODO: I thought this would be a good idea but locking it to thread creation should be better? 
// also shouldn't tags be made by a moderator to reduce spam and make everything more consistent
// router.post('/new', async (req: express.Request, res: express.Response) => {
//     if (req.headers.authorization == undefined) {
//         res.status(401).send('Unauthorized')
//         return
//     }
//     let user: JWTPayload
//     try {
//         user = auth.verify(req.headers.authorization, true)
//     } catch (err: any) {
//         res.status(401).send('Unauthorized')
//         return
//     }
//     // TODO: Really annoying edge case (because of JWT): 
//     // if a user changes accountId in between generating a token and creating a tag,
//     // they are not authorized to create one but do so anyways 
//     const db = req.app.get('db');
//     try {
//         const [result, fields] = await db.execute(
//             'insert into posts (threadId, authorId, content) values (?, ?, ?)',
//             [req.params.id, user.userId, req.body.content]
//         )
//         res.status(201).send({ id: result.insertId })
//         return
//     } catch (err: any) {
//         console.error(err)
//         res.status(500).send()
//         return
//     }
// })

router.get('/', async (req: express.Request, res: express.Response) => {
    const db = req.app.get('db');
    try {
        const [result, fields] = await db.execute(
            'SELECT * FROM threadtags'
        )
        res.send(result)
        return
    } catch (err: any) {
        console.error(err)
        res.status(500).send()
        return
    }
})

module.exports = router