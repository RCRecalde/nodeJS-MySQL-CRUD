const mysql = require('mysql')
const {promisify} = require('util')
const {database} =require('./keys')

const pool = mysql.createPool(database) //conexion a la db, ejecuta las tareas en secuencia

pool.getConnection((err, connection) => {
    if(err){
        if (err.code === 'PROTOCOL_CONNECTION_LOST'){
          console.error('DATABASE CONNECTION CLOSED')  
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TOO MANY CONNECTIONS')
        }
        if (err.code === 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION REFUSED')
        }
    }
    if(connection) connection.release()
    console.log('Database is Connected');
    return
})

pool.query = promisify(pool.query) //consulta a la db, callbacks a promesas

module.exports=pool