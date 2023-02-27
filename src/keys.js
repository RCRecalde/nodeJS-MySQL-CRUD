require('dotenv').config()

module.exports = {
    database: {
        host: 'localhost',
        user: process.env.DB_USER,
        password:process.env.DB_PASS, 
        database: 'database_links2'
    }
}