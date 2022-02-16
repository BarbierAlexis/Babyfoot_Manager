const {Client} = require('pg');
const { db, dbPassword, dbPort, dbUser } = require('./config');

const client = new Client({
    host: "localhost",
    user: dbUser,
    port: dbPort,
    password: dbPassword,
    database: db,
});

client.connect();

client.query(`Select * from game`, (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log(res.rows);
    }
    client.end;
});