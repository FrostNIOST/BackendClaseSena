/**
 * archivo de configuracion central del backend
 * este archivo centraliza todas las configuraiones principales de la aplicacion
 * configuracion de jwt tokens de autenticacion
 * configuracion de conexion a MongoDB
 * definicion de roles del sistema
 * 
 * las variables de entorno tienen prioridad sobre lo valores por defecto
 * 
 */

const { secret } = require("./config/auth.config");

module.exports = {
    //configuracion de jwt
    SECRET: process.env.JTW_SECRET || 'tusecretoparalostokens',
    TOKEN_EXPIRATION: process.env.JWT_EXPIRATION || '24h',

    //configuracion de bases de datos
    DB:{
        URL: process.env.MONGODB_URI || 'mongodb://localhost:27017/crud-mongo', OPTIONS: {
            useNewUriParser: true,
            useUnifiedTopology: true,
        
        },
    },


    //roles del sistema
    ROLES: {
        ADMIN: 'admin',
        COORDINADOR: 'coordinador',
        AUXILIAR: 'auxiliar',
        USER: 'user',

    },

};