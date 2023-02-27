//cifra contraseña
const bcrypt = require('bcryptjs')

const helpers = {} 

helpers.encryptPassword = async (password) => { //recibo la contraseña en texto plano
const salt = await bcrypt.genSalt(10) //genera el patron
const hash = await bcrypt.hash(password, salt) //cifra la contraseña con el patron
return hash
}
//compara la contraseña en texto plano con la cifrada en la db
helpers.matchPassword = (password, savedPassword) => { 
    try {
        return bcrypt.compare(password, savedPassword)
    } catch (error) {
      console.log(error);  
    }
}
module.exports = helpers