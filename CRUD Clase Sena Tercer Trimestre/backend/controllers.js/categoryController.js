/**
 * Controller para las categorias 
 * maneja todas la operaciones (CRUD) relacionadas cpn categorias
 * 
 */

const Category = require('../models/Category');

/**
 * create: crear nueva categoria 
 * POST /api/categories
 * Auth bearer token requerido 
 * Roles: admin y coordinador 
 * body requerido:
 * name nombre de la ctaegoria
 * descripcion: descripcion de la categoria
 * retorna:
 * 201: categoria creada en MongoDB
 * 400: validacion fallida o nombre duplicado
 * 500: error de la base de datos
 *  
 */

exports.createCategory = async (req, res) => {
    try {
        const { name, descripcion } = req.body;
        //validacion de los campos de entrada
        if (!name || typeof name !== 'string' || !name.trim()) {
            return res, status(400).json({
                success: false,
                message: 'El nombre es obligatorio debe ser texto valido',

            });
        }

        if (!descripcion || typeof name !== 'string' || !name.trim()) {
            return res, status(400).json({
                success: false,
                message: 'El descripción es obligatorio debe ser texto valido',

            });
        }

        // limpiar los escpacios en blaco
        const trimmedName = name.trim();
        const trimmedDesc = descripcion.trim();

        //verifica si ya existe una categoria con el mismo nombre 
        const existingCategory = await Category.findOne ({name: trimmedName});
        if (existingCategory){
            return res.status(400).json({
                success: false,
                message: 'Ya existe una categoria con ese nombre'
            });
        }

        // crear nueva categoria
        const newCategory = new Category ({
            name: trimmedName,
            descripcion: trimmedDesc,
        });
        
        await newCategory.save();

        res.status(201).json({
            success: true,
            message: 'Categoria creada exitosamente',
            data: newCategory,
        });

    }catch(error){
        console.error ('error en createCategory', error);

        if (error.code ===11000){
            return res.status(400).json({
                success: false,
                message: 'Ya existe una categoria con ese nombre'
            });
        }
        //error de servidor
        return res.status(500).json({
            success: false,
            message: 'Error al crear categoria',
            error: error.message,
        });
    }
};

/**
 * GET consultar listado de categorias
 * GET /api/categories
 * por defecto retorna solo las categrias activas 
 * con includeInactive=true retorna todas las categorias incluyendo las inactivas
 * ordena por decendente por fecha de creacion
 * retorna:
 * 200: lista de categorias
 * 500: error de la base de datos
 * 
 */

exports.getCategories = async (req, res) => {
    // por defecto solo las categorias activas
    //includeInactive=true permite ver desactivadas
    const includeInactive = req.query.includeInactive === 'true';
    const activeFilter = includeInactive ? {} : {active: {$ne: false}};
    const categories = await Category.find(activeFilter).sort({cretedAt: -1});
    res.status(200).json({
        success: true,
        data: categories,
    });
}