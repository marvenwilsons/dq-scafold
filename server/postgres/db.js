const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.connectionString
})

module.exports = {
    query : (text, params) => pool.query(text,params)
}