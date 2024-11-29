import express from 'express';
const router = express.Router()
import argon2 from 'argon2';
import auth from '../util/auth';

router.get('/:id', (req: express.Request, res: express.Response) => {
    if (req.headers.authorization == undefined) {
        res.status(401).send('Unauthorized')
        return
    }
    if (auth.verify(req.headers.authorization)) {
        res.send(`Correctly authenticated ${req.params.id}!`)
    }

})

router.post('/register', async (req: express.Request, res: express.Response) => {
    const db = req.app.get('db');

    // TODO: no validation

    const hash = await argon2.hash(req.body.password)
    // argon 2 returns a salted password, ready to store

    // TODO: Add jdenticon https://jdenticon.com/get-started/node-js.html
    try {
        const [results, fields] = await db.execute(
            'INSERT INTO users (username, displayName, email, password) VALUES (?,?,?,?)',
            [req.body.email, req.body.email, req.body.email, hash]
        )
        console.log(results, fields)
        const jwt = auth.generate({ userId: results.insertId, email: req.body.email })
        res.send({ token: jwt })
        return
    } catch (err: any) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).send('User with this e-mail already exists')
            return
        }
        console.error(err)
        res.status(500).send()
        return
    }
})

router.post('/login', async (req: express.Request, res: express.Response) => {
    const db = req.app.get('db');
    console.log(req)
    try {
        const [results, fields] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [req.body.email]
        )
        if (results.length === 0) {
            res.status(401).send('Account with this e-mail does not exist')
            return
        }
        const user = results[0]
        if (! await argon2.verify(user.password, req.body.password)) {
            res.status(401).send('Invalid password')
            return
        }
        const jwt = auth.generate({ userId: user.id, email: req.body.email })
        res.send({ token: jwt, user: { id: user.id, username: user.username, displayName: user.displayName, email: user.email, registerDate: user.registerDate } })
        return
    } catch (err: any) {
        console.error(err)
        res.status(500).send()
        return
    }
})


module.exports = router