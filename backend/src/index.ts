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
        `jwtsecret=${require('crypto').randomBytes(64).toString('hex')}\n` +
        `PORT=8080\n`
    fs.writeFileSync('.env', newEnv, 'utf8')
    require('dotenv').config() // Reload .env after writing
}

async function initializeDatabase() {
    const db = await mysql.createConnection({
        host: process.env.dbhost,
        user: process.env.dbuser,
        password: process.env.dbpassword,
        multipleStatements: true // allow for processing schema
    });

    // We are not catching errors to stop the app from going further with bad data
    // TODO: Graceful recovery from some of these errors
    // TODO: SQL Injection but that's on you if you have one in your .env
    const [results, fields]: any = await db.query(`SELECT EXISTS (
    SELECT 1 
    FROM INFORMATION_SCHEMA.SCHEMATA 
    WHERE SCHEMA_NAME LIKE '${process.env.dbname}'
    ) AS database_exists;`);
    if (results[0].database_exists > 0) {
        console.log("Database detected");
    } else {
        console.error("====================================\n" +
            "Database not detected, trying to import\n" +
            "====================================");
        await db.query(`CREATE DATABASE ${process.env.dbname}; USE ${process.env.dbname};`);
        const schema = fs.readFileSync('SampleDB.sql', 'utf8').toString();
        await db.query(schema);
        console.log("Schema successfully loaded");
    }
    await db.end();
}

initializeDatabase().then(() => {

    //Unnecessary for now, might be needed later
    //app.use(bodyParser.urlencoded({ extended: false }))
    app.use(express.json())


    const pool = mysql.createPool({
        host: process.env.dbhost,
        user: process.env.dbuser,
        password: process.env.dbpassword,
        database: process.env.dbname,
    })

    app.set('pool', pool) // TODO: This messes with type safety

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
    app.use('/api/v1/posts', require('./routes/posts'))


    app.listen(port, () => console.log(`Backend is up at http://localhost:${process.env.PORT}`))
})