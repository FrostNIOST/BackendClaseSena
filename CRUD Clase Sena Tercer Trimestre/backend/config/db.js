//Conexion con la base de datos
module.exports = {
    url:process.env.MONGODB_URI || "mongodb://localhost:27027/crud-mongo" //la url donde se ejecuta el backend
};