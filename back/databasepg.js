const {Client} = require('pg');
const { db, dbPassword, dbPort, dbUser } = require('./config');

const client = new Client({
    host: "localhost",
    user: dbUser,
    port: dbPort,
    password: dbPassword,
    database: db,
});

module.exports = client;