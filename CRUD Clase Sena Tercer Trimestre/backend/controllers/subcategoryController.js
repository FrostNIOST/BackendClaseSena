/**
 * Controlador de 
 * estrucctura de datos de subcategorias depende de una categora padre, una categoria puede tener varias subcategorias, 
 * cuando una subactaegoria se elimina los productos relacionados se deactivan
 * cuando se ejecutan en cascada softdelete se elimina de manera permanente 
 * 
 */


const Subcategory = require('../models/SubCategory');
const Category = require('../models/Category');

/**
 * create: crear nueva subcategoria 
 * POST /api/categories
 * Auth bearer token requerido 
 * Roles: admin y coordinador 
 * body requerido:
 * name nombre de la ctaegoria
 * descripcion: descripcion de la categoria
 * retorna:
 * 201: subcategoria creada en MongoDB
 * 400: validacion fallida o nombre duplicado
 * 500: error de la base de datos
 *  
 */


exports.createSubategory = async (req, res) => {
    try {
        const { name, descripcion, category } = req.body;
        //validar que la subcategoria padre exista
        const parentCategory = await Category.findById(category);
        if (!parentCategory) {
            return res.status(400).json({
                success: false,
                message: 'La categoria no existe'
            });
        }


        // crear nueva subcategoria
        const newSubcategory = new Subcategory({
            name: name.trim(),
            descripcion: descripcion.trim(),
            category: category,
        });

        await newSubategory.save();

        res.status(201).json({
            success: true,
            message: 'Categoria creada exitosamente',
            data: newSubcategory,
        });

    } catch (error) {
        console.error('error en createSubcategory', error);

        if (error.message.includes('duplicate key') || error.message.includes('ya existe')) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una subcategoria con ese nombre'
            });
        }
        //error de servidor
        return res.status(500).json({
            success: false,
            message: 'Error al crear subcategoria',
        });
    }
};

/**
 * GET consultar listado de subcategorias
 * GET /api/subcategories
 * por defecto retorna solo las subcategorias activas
 * con includeInactive=true retorna todas las subcategorias incluyendo las inactivas
 * ordena por decendente por fecha de creacion
 * retorna:
 * 200: lista de subcategorias
 * 500: error de la base de datos
 * 
 */

exports.getSubcategories = async (req, res) => {
    try {


        // por defecto solo las subcategorias activas
        //includeInactive=true permite ver desactivadas
        const includeInactive = req.query.includeInactive === 'true';
        const activeFilter = includeInactive ? {} : { active: { $ne: false } };


        const subcategories = await Subcategory.find(activeFilter).populate('category', 'name');
        res.status(200).json({
            success: true,
            data: subcategories,
        });
    } catch (error) {
        console.error('error al obtener subcategorias', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener subcategorias',

        });
    }
};

/**
 * READ obtener  una Subcategorias especificar id 
 * GET /api/subategories/:id
 */

exports.getSubcategoriesById = async (req, res) => {
    try {


        // por defecto solo las subcategorias activas
        //includeInactive=true permite ver desactivadas

        const subcategory = await Subcategory.findById(req.params.id).populate('category', 'name');
        if (!subcategory) {
            return res.status(404).json({
                success: false,
                message: 'subcategoria no encontrada',
            })
        }

        res.status(200).json({
            success: true,
            data: subcategory,
        });
    } catch (error) {
        console.error('error en getSubcategoriasById', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener subcategorias',
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
 * category nuevo id de la categoria
 * validaciones
 * si se cambia la categoria verifica que exista 
 * si solo quiere actualizar solo el nombre o los dos
 * retorna:
 * (200) subCategoria actualizada
 * (404) subCategoria no encontrada
 * (500) error de la base de datos
 */


exports.updateSubcategory = async (req, res) => {
    try {
        const { name, descripcion, category } = req.body;

        //verificar si cambia la categoria padre

        if (category) {
            const parentCategory = await Category.findById(category);
            if (!parentCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'la categoria no existe'
                });
            }
        }


        //construir un objeto de actualizacion solo con campos enviados
        const updateSubcategory = await Subcategory.findOneAndUpdate(
            req.params.id,
            {
                name: name ? name.trim() : undefined,
                descripcion: descripcion ? descripcion.trim() : undefined,
                category
            },
            { new: true, runValidators: true }
        );
        if (!updateSubcategory) {
            return res.status(404).json({
                success: false,
                message: 'Subategoria no encontrada'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Subcategoria actualizada existosamente',
            data: updateSubcategory,
        });

    } catch (error) {
        console.error('error en updateSubategory', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar subcategorias',
        });
    }
};

/**
 * Delete Eliminar o desactivar una subcategoria
 * DELETE /api/subcategories/:id
 * auth bearer token requerido
 * roles: admin
 * query param
 * hardDelete=true eliminar permanentemente de la base de datos
 * Default: soft delete (solo desactivar)
 * SOFT Delete: marca la subcategoria como inactiva 
 * Desactiva en cascada todas las subcategorias, productos relacionados 
 * al activar retorna todos los datos incluyendo los inactivos
 *
 * HARD Delete: elimina permanentemente la productos de la base de datos
 * elimina en cascada la categoria, subcategoria y productos relacionados
 * No se puede recuperar
 * retorna
 * (200) subcategoria eliminada o desactivada exitosamente
 * (404) subcategoria no encontrada
 * (500) error en la base de datos
 */

exports.deleteSubcategory = async (req, res) => {
    try {
        const Product = require('../models/Product');
        const isHardDelete = req.query.hardDelete === 'true';

        // buscar la subcategoria a eliminar o desactivar
        const subcategory = await Subcategory.findById(req.params.id);
        if (!subcategory) {
            return res.status(404).json({
                success: false,
                message: 'Subcategoria no encontrada'
            });
        }

        //

        if (isHardDelete) {

            // eliminar subcategorias y productos relacionados
            //paso 1 obtener los ids de las subcategorias relacionadas para eliminar sus productos
            await Product.deleteMany ({ subCategory: req.params.id });

            // paso 2 eliminar todos los productos de esta subcategoria

            await Product.deleteMany({ subCategory: req.params.id }); 

            res.status(200).json({
                success: true,
                message: 'subcategoria permentemente eliminada y sus subcategorias y productos relacionados',
                data: {
                    subcategory: subcategory,
                
                }
            });
        } else {
            //soft delete solo marcar como inactivo 
            products.active = false;
            await products.save();


            //desactivar todas las subcategorias relacionadas
            const subcategories = await SubCategory.updateMany(
                { category: req.params.id },
                { active: false },
            );


            //desactivar todos los productos relacionados
            const products = await Product.updateMany(
                { category: req.params.id },
                { active: false },
            );
        }


    } catch (error) {
        console.error('Error al desactivar la subcategoria', error);
        res.status(500).json({
            success: false,
            message: 'Error al desactivar la subcategoria',
            error: error.message,
        });
    }
}