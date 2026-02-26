/**
 * MIDDLEWARE DE VERIFICACION JWT
 * middleware para verificar y validar tokens jwt en las solicitudes
 * se usan todas las rutas protegidas para autenticar usuarios
 * caracteristicas:
 * soporta dos fomratos de token
 * 1 Authorization: bearer <token> (estandar REST)
 * 2 x-access-token (header personalizado)
 * extrae informacion del token (id role email) (x-access-token trae)
 * la adjunta a req.UserId req.userRole, req.userEmail para uso de los controladores
 * manejo de errores con codigos 403/401 apropiados
 * Flujo:
 * 1. lee el header Authorization o x-access-token 
 * 2. Extrae el token (quita el bearer si es necesario)
 * 3. verifica el token con JWT_SECRET
 * 4. Si es valido continua al siguiente middleware
 * 5. si es invalido retorna error 401 Unauthorized
 * 6. Si falta el token retorna 403 Forbidden
 * 
 * Validacion del token
 * 1. verifica firma criptografica con JWT_SECRET
 * 2. Comprueba que no haya expirado
 * 3. Extrae payload {id, role, email}
 * 
 */

const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

/**
 * verificar el token 
 * funcionalidad
 * busca el token en las ubicaciones posibles (orden de procedencia)
 * 1. header Authorization con formato bearer <token>
 * 2. header x-access-token 
 * si encuentra el token verifica su validez
 * si no encuentra retorna 403 Forbidden
 * si el token es invalido /Expirado retorna 401 Unauthorized
 * si es valido adjunta datos del usuario a req y continua
 * 
 * Headers soportados:
 * 1. Authorized bearer <token (codificado)>
 * 2. x-access-token: <token (codificado)> id, rol, email
 * propiedades del request despues del middlware:
 * req.userId = (String) Id del usuario Mongodb
 * req.userRole = (String) Role del usuario en Mongodb (admin, coordinador, auxiliar)
 * req.userEmail = (String) Email del usuario en Mongodb
 */

const verifyTokenFn = (req, res, next) => {
    try{
        // soportar dos formatos de autorizacion bearer o x-access-token
        let token = null;

        //formato de autorizacion
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            //extraer token quitando el bearer
            token = req.headers.authorization.substring(7);      
        }

        //formato de x-access-token
        else if (req.headers['x-access-token']){
            token = req.headers['x-access-token'];
        }

        //sino encontro el token rechaza la solicitud
        if (!token){
            return res.status(403).json({
                success: false,
                message: 'Token no proporcionado',
            });
        }

        //verifica el token con la clave secreta
        const decoded = jwt.verify(token, config.secret);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.userEmail = decoded.email;        
        
        next();


    }catch (error) {
        //token invalido o error en la verificacion
        return res.status(401).json({
            success: false,
            message: 'Token invalido o expirado',
            error: error.message,
        });        
    }
};

/**
 * validacion de funcion para mejor seguridad y manejo de errores
 * verificar que verifyTokenFn sea una funcion valida
 * esto es una validacion de seguridad para que el middleware se exporte correctamente
 * si algo sale mal en su definicion lanzara un error en el tiempo de carga del modulo
 * 
 */

if (typeof verifyTokenFn !== 'function'){
    console.error('error: verifyTokenFn no es una funcion valida');
    throw new Error ('verifyTokenFn debe ser una funcion');
}

//exportar el middleware
module.exports = {
    verifyTokenFn: verifyTokenFn

};