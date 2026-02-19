/**
 * debe tener los 3 modelos relacionados, categoria, subcategoria y producto, para manejar las relaciones entre ellos
 * debe tener las funciones de CRUD para cada modelo, con validaciones y manejo de errores adecuado
 *  
 */


/**
 * Controller para los productos
 * maneja todas la operaciones (CRUD) relacionadas con productos
 * 
 */

const Subategory = require('../models/Category');
const Product = require('../models/Product');

/**
 * create: crear nuevo producto
 * POST /api/product
 * Auth bearer token requerido 
 * Roles: admin y coordinador 
 * body requerido:
 * name nombre del producto
 * descripcion: descripcion de la producto
 * retorna:
 * 201: producto creado en MongoDB
 * 400: validacion fallida o nombre duplicado
 * 500: error de la base de datos
 *  
 */

exports.createProduct = async (req, res) => {
    try {
        const { name, description, subcategory } = req.body;
        //validar que el producto exista
        const parentProduct = await Subcategory.findById(subategory);
        if (!parentProduct) {
            return res.status(400).json({
                success: false,
                message: 'El producto no existe'
            });
        }

        //crear nuevo producto
        const newProduct = new Product({
            name: name.trim(),
            description: description.trim(),
            subategory: subcategory,
        });

        await newProduct.save();

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: newProduct,
        });

    } catch (error) {
        console.error('error en createProduct', error);

        if (error.message.includes('duplicate key') || error.message.includes('ya existe')) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un producto con ese nombre'
            });
        }
        //error de servidor
        return res.status(500).json({
            success: false,
            message: 'Error al crear producto',
        });
    }



/**
 * GET consultar listado de productos
 * GET /api/products
 * 
 * por defecto retorna solo las subcategorias activas
 * con includeInactive=true retorna todas las subcategorias incluyendo las inactivas
 * ordena por decendente por fecha de creacion
 * retorna:
 * 200: lista de subcategorias
 * 500: error de la base de datos
 * 
 */


}