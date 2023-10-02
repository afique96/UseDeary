const pg = require('pg')
require("dotenv").config();

const ClientClass = pg.Client
const pgUrl = process.env.DB_URL

const pool = new ClientClass(pgUrl)

pool.connect();

module.exports = pool;