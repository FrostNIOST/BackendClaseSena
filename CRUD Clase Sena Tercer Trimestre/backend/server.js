/**
 * SERVIDOR PRINCIPAL
 * 
 * punto de entrada a la aplicacion backend
 * configura Express, cors, conecta MongoDB, define rutas y conecta con el frontend
 */

require('dotenv').config(); //carga las variables de entorno
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); //permite conectar con  elfrontend
const morgan = require('morgan'); //imprime las peticiones de la consola
const config = require('./config');

/**
 * validaciones iniciales
 * verifica que las variables de entorno requeridas esten definidas
 */

if (!process.env.MONGODB_URI) {
    console.log('Error: MONGO_URI no esta definida en env');
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.log('Error: JTW_SECRET no esta definida en env');
    process.exit(1);
}
//importar todas las rutas 
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const statisticsRoutes = require('./routes/statisticsRouter');

//iniciar express
const app = express();

//Cors permite las solicitudes desde el frontend
app.use(cors({
    origin: 'http://localhost:3001',
    credentiales: true,


}));

//morgan registra todas las solicitudes http en consola
app.use(morgan('dev'));

//Express json parsea bodies en formato json
app.use(express.json());

//Express URL encoded soporta datos form-encoded
app.use(express.urlencoded({extended: true}));

//conexion a mongoDB 
mongoose.connect(process.env.MONGODB_URI) 
.then(() => console.log('MongoDB conectado correctamente'))
.catch(err => {
    console.error('Error de conexion a MongoDB', err.message);
    process.exit(1);

});

//registra rutas

//rutas de autenticacion
app.use('/api/auth', authRoutes);

//rutas de usuario CRUD
app.use('/api/users', userRoutes);

//rutas de productos CRUD
app.use('/api/products', productRoutes);

//Rutas de categorias CRUD
app.use('/api/categories', categoryRoutes);

//rutas de subcategorias CRUD
app.use('/api/subcategories', subCategoryRoutes);

//Rutas de estadisticas 
app.use('/api/statistics', statisticsRoutes);

//manejo de errores globales
app.use((req, res) =>{
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

//inicar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});


