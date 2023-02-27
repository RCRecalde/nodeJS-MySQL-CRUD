const express = require('express')
const morgan = require('morgan') //muestra por consola la peticiones del usuario al servidor 
const exhbs = require('express-handlebars') //motor de plantillas  
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const MySQLStore = require ('express-mysql-session') //guarda la session en la db

const passport = require('passport')


const {database} = require('./keys')

//initializations
const app = express()
require('./lib/passport')


//settings
app.set('port', process.env.PORT || 4000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exhbs.engine({
    defaultLayout: 'main',
    layoutDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs')

//MW
app.use(session({
    secret: 'nodeMysql',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}))
app.use(flash())
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false})) 
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())

//Global variables
//msj y usuario en sesion disponible en todas las vistas
app.use((req, res, next) =>{
    app.locals.success = req.flash('success')
    app.locals.message = req.flash('message')
    app.locals.user = req.user 
    next()
})

//Routes
app.use(require('./routes/index'))
app.use(require('./routes/authentication'))
app.use('/links', require('./routes/links'))


//Public
app.use(express.static(path.join(__dirname, 'public')))

//Starting the server
app.listen(app.get('port'), () =>{
    console.log('Server on port ', app.get('port'));
})