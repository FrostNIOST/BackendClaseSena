// carga la variable de entorno desde .env
require('dotenv').config();

module.exports={
    //Clave secreta para firmar los tokens de json web token (jwt)
    secret: process.env.JWT_SECRET || "tusecretoparalostokens",
    // Tiempo de expiracion del token en segundos
    jwtExpiration: process.env.JWT_EXPIRATION || 86400,//24 HORAS
    //TIEMPO DE EPIRACION DE REFRESCAR TOKENS 
    jwtRefresh: 6048000, // 7 dias
    //numero de rondas para encriptar la contraseña 
    slatRounds: process.env.SALT_ROUNDS || 8 //
};