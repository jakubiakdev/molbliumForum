import express from 'express';
const router = express.Router()
import auth from '../util/auth';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../util/auth';

router.delete('/:id', async (req: express.Request, res: express.Response) => {
    if (req.headers.authorization == undefined) {
        res.status(401).send('Unauthorized')
        return
    }
    let user:JWTPayload
    try {
        user = auth.verify(req.headers.authorization, true)
    } catch (err: any) {
        res.status(401).send('Unauthorized')
        return
    }
    //TODO: JWT Edge case
    const db = req.app.get('db');
    try {
        const [result, fields] = await db.execute(
            'DELETE FROM posts WHERE posts.id = ? and authorId = ?',
            [req.params.id, user.userId]
        )
        // Differentiating between found posts with no permissions and no posts at all might lead to leaks(i think?)
        if(result.affectedRows === 0) {
            res.status(500).send({error: 'Could not find a post created by the user'})
            return
        }
        res.send()
        return
    } catch (err: any) {
        console.error(err)
        res.status(500).send()
        return
    }
})

module.exports = router