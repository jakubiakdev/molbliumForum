import express from 'express';
const router = express.Router()
import argon2 from 'argon2';
import auth from '../util/auth';

router.get('/me', (req: express.Request, res: express.Response) => { // TODO: this doesn't seem very smart?
    if (req.headers.authorization == undefined) {
        res.status(401).send({error: 'Unauthorized'})
        return
    }
    if (auth.verify(req.headers.authorization)) {
        res.send(`Correctly authenticated ${req.params.id}!`)
    }

}) 

router.post('/register', async (req: express.Request, res: express.Response) => {
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();

    const hash = await argon2.hash(req.body.password)
    // argon 2 returns a salted password, ready to store

    try {
        await conn.beginTransaction()
        const [aResults, aFields] = await conn.execute(
            'INSERT INTO accounts (email, password) VALUES (?,?)',
            [req.body.email, hash]
        )
        if(aResults.insertId) {
            const [uResults, uFields] = await conn.execute(
                'INSERT INTO users (accountId, username, displayName) VALUES (?,?,?)',
                [aResults.insertId, req.body.username, req.body.displayName]
            )
            conn.commit()
            res.status(201).send();
            return
        } else {
            throw new Error("Could not create account")
        }
    } catch (err: any) {
        await conn.rollback()
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).send({error: 'User with this e-mail and/or username already exists'})
            return
        }
        console.error(err)
        res.status(500).send({error: 'Internal server error'})
        return
    } finally {
        conn.release()
    }
})

router.post('/login', async (req: express.Request, res: express.Response) => {
    const db = req.app.get('pool');
    try {
        const [results, fields] = await db.execute(
            'SELECT accounts.password,accountId,users.* FROM accounts JOIN users ON accounts.id = users.accountId WHERE email = ?',
            [req.body.email]
        )
        if (results.length === 0) {
            res.status(401).send({error: 'Account with this e-mail does not exist'})
            return
        }
        const user = results[0]
        if (! await argon2.verify(user.password, req.body.password)) {
            res.status(401).send({error:'Invalid password'})
            return
        }
        const jwt = auth.generate({ userId: user.id, accountId: user.accountId })
        const tokenExpiry = Date.now() + 60 * 60 * 1000 // 1 hour
        res.send({ token: jwt, tokenExpiry: tokenExpiry, user: { id: user.id, username: user.username, displayName: user.displayName, email: user.email, registerDate: user.registerDate } })
        return
    } catch (err: any) {
        console.error(err)
        res.status(500).send({error: 'Internal server error'})
        return
    }
})

router.get('/:id', async (req: express.Request, res: express.Response) => {
    const db = req.app.get('pool');

    try {
        const [results, fields] = await db.execute(
            'select id,username,displayName,registerDate from users where id = ?',
            [req.params.id]
        )
        if(results.length === 0) {
            res.status(404).send({error: 'User not found'})
            return
        }
        res.send(results[0])
        return
    } catch (err: any) {
        console.error(err)
        res.status(500).send()
    }
})


module.exports = router