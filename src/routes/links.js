const express = require('express')
const router = express.Router()
const pool = require('../database')
const {isLoggedIn}=require('../lib/auth')

//VISTA DE CREACION
router.get('/add',isLoggedIn,(req, res) => {
    res.render('links/add')
})
//CREAR LINK
router.post('/add', isLoggedIn,async (req, res) => {
    const { title, url, description } = req.body
    const newLink = {
        title,
        url,
        description,
        user_id:req.user.id //cuando creamos un link,toma el id de la sesión del usuario y lo almacena 
    }
    await pool.query('INSERT INTO links set ?', [newLink])
    //connect flash envia mensajes al usuario. Parametros: nombre del msj y su valor
    req.flash('success', 'Saved succesfully')
    res.redirect('/links')
})
//LISTA DE LINKS
router.get('/', isLoggedIn,async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id])
    res.render('links/list', { links })
})
//ELIMINAR LINK
router.get('/delete/:id', isLoggedIn,async (req, res) => {
    const { id } = req.params
    await pool.query('DELETE FROM links WHERE ID = ?', [id])
    req.flash('success', 'Link Removed')
    res.redirect('/links')
})
//EDITAR 
router.get('/edit/:id', isLoggedIn,async (req, res) => {
    const { id } = (req.params)
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id])
    //[0] muestra solo el objeto {} no el array con el objeto
    res.render('links/edit', {link: links[0]})
})

router.post('/edit/:id', isLoggedIn,async (req, res) =>
{
    const {id} =req.params
    const {title, url, description} =req.body
    const newLink ={
        url,
        title,
        description,

    }
    //console.log(newLink);
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id])
    req.flash('success', 'Link Updated')
    res.redirect('/links')
})

module.exports = router 