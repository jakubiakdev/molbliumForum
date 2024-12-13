import express from 'express'
const app = express()
const port = 8080
const bodyParser = require('body-parser')
const fs = require('fs')

import mysql from 'mysql2/promise';

const result = require('dotenv').config()

if (result.error) {
    console.error("====================================\n" +
        "Couldn't load .env, populating with default values\n" +
        "====================================")
    let newEnv =
        `dbhost=localhost\n` +
        `dbname=molblium\n` +
        `dbuser=root\n` +
        `dbpassword=\n` +
        `jwtsecret=${require('crypto').randomBytes(64).toString('hex')}\n`
    fs.writeFileSync('.env', newEnv, 'utf8')
}


// let db = mysql.createConnection({
//     host: process.env.dbhost,
//     user: process.env.dbuser,
//     password: process.env.dbpassword,
//     multipleStatements: true // allow for reading schema
// });

app.use(bodyParser.urlencoded({ extended: false })) // TODO: do we need this if we're using json and react query?
app.use(express.json())


mysql.createConnection({
    host: process.env.dbhost,
    user: process.env.dbuser,
    password: process.env.dbpassword,
    database: process.env.dbname,
}).then((db) => {

    app.set('db', db)

    app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
        // TODO: this is unsafe!
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Methods', '*')
        res.header('Access-Control-Allow-Headers', '*')
        next()
    })

    app.use('/api/v1/users', require('./routes/users'))
    app.use('/api/v1/threads', require('./routes/threads'))
    app.use('/api/v1/tags', require('./routes/tags'))


    app.listen(port, () => console.log(`Backend is up at http://localhost:${port}`))
})