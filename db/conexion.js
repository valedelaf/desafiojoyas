const { Pool } = require('pg')

const pool = new Pool({
host: 'localhost',
user: 'postgres',
password: 'trufa1507',
database: 'JoyasDesafio',
allowExitOnIdle: true
})


module.exports = pool;