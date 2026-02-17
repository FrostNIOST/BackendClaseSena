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
        const existingCategory = await Category.findOne({ name: trimmedName });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una categoria con ese nombre'
            });
        }

        // crear nueva categoria
        const newCategory = new Category({
            name: trimmedName,
            descripcion: trimmedDesc,
        });

        await newCategory.save();

        res.status(201).json({
            success: true,
            message: 'Categoria creada exitosamente',
            data: newCategory,
        });

    } catch (error) {
        console.error('error en createCategory', error);

        if (error.code === 11000) {
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
    try {


        // por defecto solo las categorias activas
        //includeInactive=true permite ver desactivadas
        const includeInactive = req.query.includeInactive === 'true';
        const activeFilter = includeInactive ? {} : { active: { $ne: false } };
        const categories = await Category.find(activeFilter).sort({ cretedAt: -1 });
        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error('error en getCategories', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener categorias',
            error: error.message,
        });
    }
};

/**
 * READ obtener  una categorais especificar id 
 * GET /api/Categories/:id
 */

exports.getCategoriesById = async (req, res) => {
    try {


        // por defecto solo las categorias activas
        //includeInactive=true permite ver desactivadas

        const categories = await Category.findById(req.params.id)
        if (!categories) {
            return res.status(404).json({
                success: false,
                message: 'Categoria no encontrada'
            })
        }

        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error('error en getCategoriesById', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener categorias',
            error: error.message,
        });
    }
};

/**
 * UPDATE actualizar categoria existente
 * PUT /api/Categorias:id
 * auth bearer token requerido
 * Roles: admin y coordinador
 * body
 * name: Nuevo nombre de la ctaegoria
 * descripcion: nueva descripcion
 * validaciones
 * si solo quiere actualizar solo el nombre o los dos
 * retorna:
 * (200) categoria actualizada
 * (300)nombre duplicado
 * (404) Categoria no encontrada
 * (500) error de la base de datos
 */


exports.updateCategory = async (req, res) => {
    try {
        const { name, descripcion } = req.body;
        const updateData = {};

        //Solo actualizar campos que dueron enviados 
        if (name) {
            updateData.name = name.trim();

            //veificar si el nuevo nombre ya existe en otra categoria
            const existing = await Category.findOne({
                name: updateData.name,
                _id: { $ne: req.params.id }, //asegura que el nombre no sea el mismo id

            });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'Este nombre ya existe'
                });
            }
        }
        if (descripcion) {
            updateData.descripcion = descripcion.trim();

        }

        //Acutalizar la categoria e la base de datos
        const updateCategory = await Category.findOneAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!updateCategory) {
            return res.status(404).json({
                success: false,
                message: 'Categoria no encontrada'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Categoria actualizada existosamente',
            data: updateCategory,
        });

    } catch (error) {
        console.error('error en updateCategory', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar categorias',
            error: error.message,
        });
    }
};

/**
 * Delete Eliminar o desactivar unactaegoria 
 * DELETE /api/categories/:id
 * auth bearer token requerido
 * roles: admin
 * query param
 * hardDelete=true eliminar permanentemente de la base de datos
 * Default: soft delete (solo desactivar)
 * SOFT Delete: marca la categoria como inactiva 
 * Desactiva en cascada todas las subcategorias, productos relacionados 
 * al activar retorna todos los datos incluyendo los inactivos
 * 
 * HARD Delete: elimina permanentemente la categoria de la base de datos 
 * elimina en cascada la categoria, subcategoria y productos relaacionados
 * No se puede recuperar 
 * 
 * retorna
 * (200) categoria eliminada o desactivada exitosamente
 * (404) categoria no encontrada
 * (500) error en la base de datos 
 */

exports.deleteCategory = async (req, res) => {
    try {
        const SubCategory = require('../models/SubCategory');
        const Product = require('../models/Product');
        const isHardDelete = req.query.hardDelete === 'true';

        // buscar la categoria a eliminar o desactivar
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categoria no encontrada'
            });
        }

        //

        if (isHardDelete) {

            //paso 1  obtener IDs 
            const subIds = (await SubCategory.find({ category: req.params.id })).map(s => s._id);


            //paso 2 eliminar todos los productos categoria
            await Product.deleteMany({ category: req.params.id })

            //paso 3 eliminar todos los productos de las subcategorias de esta categoria
            await Product.deleteMany({ subCategory: { $in: subIds } });

            // paso 4 eliminar todas las subcategorias de esta categoria

            await SubCategory.deleteMany({ category: req.params.id });

            //paso 5 Eliminar la categoria misma
            await category.findByIdAndDelete(req.params.id);

            res.status(200).json({
                success: true,
                message: 'categoria permentemente eliminada y sus subcategorias y productos relacionados',
                data: {
                    category: category,
                }
            });
        } else {
            //soft delete solo marcar como inactivo 
            category.active = false;
            await category .save();


            //desactivar todas las subcategorias relacionadas
            const subcategories = await SubCategory.updateMany(
                {category: req.params.id},
                {active: false},
            );


            //desactivar todos los productos relacionados por la categoria y subcategoria 
            const products = await Product.updateMany(
                {category: req.params.id},
                {active: false},
            );

            res.status(200).json({
                success: true,
                message: 'Categoria desactivaa exitosamente y su subcategoria y productos asociados',
                data: {
                    category: category,
                    subcategoriesDesactivated: subcategories.modifiedCount,
                    productsDesactivated: products.modifiedCount, 
                    
                    
                }
            });
        }


    } catch (error) {
        console.error('error en deleteCategory', error);
        res.status(500).json({
            success: false,
            message: 'Error al desactivar la categoria',
            error: error.message,
        });
    }
}