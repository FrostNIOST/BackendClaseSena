/**
 * controlador de estadiscas
 * get /api/statistics
 * ath bearer token requerido
 * estadisticas disponibles
 * total de usuarios 
 * total productos
 * total de categorias 
 * total de subcategorias
 * 
 */

const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Subcategory = require('../models/SubCategory');

/**
 * respuestas:
 * 200 ok estadisticas obtenidas
 * 500 error de servido
 */


const getStatistics = async (req, res) => {
    try{
        //ejecuta todas las queries en paralelo
        const [totalUsers, totalProducts, totalCategories, totalSubcategories] = await Promise.all ([
            User.countDocuments(), //contar usuarios
            Product.countDocuments(), // contar productos
            Category.countDocuments(), //contar categorias
            Subcategory.countDocuments(), // contar subcategorias
        ]);

        //retornar las estadisticas
        res.json({
            totalUsers,
            totalProducts,
            totalCategories,
            totalSubcategories,
        });

    }catch (error) {
        console.error('Error en getStatistics:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las estadisticas',
            error: error.message,
        });
    }
};
module.exports = {getStatistics};


