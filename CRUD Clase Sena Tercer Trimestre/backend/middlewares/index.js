/**
 * archivo indicde de middlewares
 * centraliza la importacion de todos middlewares de autenticacion y validacion
 * permite importar multiples middlewares de forma concisa en las rutas
 */


const authJWT = require('./authJwt');
const verifySingUp = require('./');

// exportar los middlewares agrupados por modulo
module.exports = {
    authJWT: require('./authJwt'),
    verifySingUp: require('./verifySignUp'),
    role: require('./role'),
};