//autenticacion
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const pool = require('../database')
const helpers = require('../lib/helpers')

//INICIO SESION
passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username])
if(rows.length > 0){

    const user = rows[0]
    const validPassword = await helpers.matchPassword(password, user.password)
    
    if(validPassword){
         done(null, user, req.flash('success', 'HI'))
    } else {
        done(null,false, req.flash('message','Incorrect password'))
    }

} else { 
    //no encontro un user
    return done(null,false,req.flash('message', 'Username do not exist'))
}
}))


//REGISTRO
passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname } = req.body
    const newUser = {
        username,
        password,
        fullname
    }
    //cifro antes de guardar
    newUser.password = await helpers.encryptPassword(password)
    const result = await pool.query('INSERT INTO users SET ?', [newUser])
    newUser.id = result.insertId
    return done(null, newUser ) //null en caso de error

}
))
//guarda el usuario dentro de la sesion
passport.serializeUser((user, done) => {
done(null, user.id)

}) 
//tomo el id almacenado para volver a obtener la info
passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users Where id = ?', [id])
    done(null, rows[0])
    }) 