import express from 'express';
const router = express.Router()

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