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

        //verificar y decodificar
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Buscar el usuario en la base de datos
        const user = await User.findById(decoded.id);

        //si no existe el usuario
        if (!user){
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        //cargar el usuario en el request para usar en los iguientes middlewares o controladores
        req.user = user;
        
        // Llamar el siguiente middlware o controller
        next();

    }catch (error) {
        //token invalido o error en la verificacion
        let message = 'Token invalido';
        if (error.name === 'TokenExpiredError'){
            message = 'Token expirado, por favor iniciar secion de nuevo nuevamente';
        }else if(error.name === 'JsonWebTokenError'){
            message = 'token invalido o mal formado';
        }
        return res.status(401).json({
            success: false,
            message: message,
            error: error.message,
        });        
    }
};

/**
 * middleware para autorizar por rol 
 * verificar que el usuario tiene uno de los dos roles requeridos se isa despues del middleware authenticate
 * @param {array} roles - array de roles permitidos 
 * @return {Function} middleware funcion 
 * 
 * uso: app.delete (./api/products/:id), authenticate, authorize (['admin'])
 */

exports.authorize = (roles) => {
    return (req, res, next) => {
    //Verificar si el rol de usuario esta en la lista de roles permitidos
    if (!roles.includes(req.user.role)){
        return res.status(403).json({
            success: false,
            message: 'No tienes autorizacion para esta accion',
            requieredRole: roles,
            currentRole: req.user.role,
            details:`tu rol es "${req.user.role}" pero se requiere uno de: ${roles.join(', ')}`
        });
    }
    //si el usuario tiene permiso continuar
    next();     
    }
};