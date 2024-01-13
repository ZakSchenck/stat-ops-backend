const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'stat_ops',
    password: process.env.DB_PASSWORD,
    port: 5432, 
});

module.exports = pool;