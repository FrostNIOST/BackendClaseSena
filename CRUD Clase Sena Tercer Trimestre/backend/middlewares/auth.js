/**
 * MIDDLEWARES: autenticacion JWT
 * 
 * verifica que el usuario tenga un token valido y carga los datos del usuario en  req.user
 */


const jwt = require('jsonwebtoken');
const User = require('../models/User');


/**
 * autenticar el usuario
 * valida el token bearer en el header Autorization
 * si es valido carga el usuario req.user
 * si no es valido o no existe retorna 401 Unauthorized
 */

exports.authenticate = async (req, res, next) => {
    try{
        //extraer el token del header Bearer <token>
        const token = req.header('Authorization')?.replace('Bearer ', '');

        //si no hay token rechaza la solicitud
        if (!token){
            return res.status(401).json({
                success: false,
                message: 'Token de autorizacion',
                details: 'incluye autorizacion de bearer <token>'
            });

        }






    }catch (error) {
        console.error('Error en autenticate:', error);
        res.status(500).json({
            success: false,
            message: 'Error al autenticar usuario',
            error: error.message,
        });
    }
}