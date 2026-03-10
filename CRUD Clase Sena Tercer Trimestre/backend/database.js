/**
 * modulo de conexion con la base de datos MongoDB
 * 
 * este archivo maneja la conexio de la base de datos a mongodb utlizando mongoose
 * establece la conexion a la base de datos configura las opciones de conexion
 * maneja los errores de conexion
 * exporta la funcion conectDB para usarla en server.js
 */

const mongoose = require('mongoose');
const {DB_URI} = process.env;
const connectDB = async ()  =>{
    try {
        await mongoose.connect(DB_URI);
            console-log('ok MongoDB conectado')
    }catch(error){
        console.error('X error de conexion a MongoDB',
        error.message);
        process.exit(1);   
    
    }
};

module.exports = connectDB;