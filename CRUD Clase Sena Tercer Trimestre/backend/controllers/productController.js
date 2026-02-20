/**
 * controlador de producto
 * maneja todas las operaciones (CRUD) relacionadas con productos
 * Estructura: un producto depende de una sub-categoría padre
 * Estructura: Usa sub-categoría depende de una categoría padre, una categoría puede tener varias sub-categorías, una sub-categoría puede tener varios productos relacionados
 * Cuando una sub-categoría se elimina los productos relacionados se desactivan
 * Cuando se ejecuta en cascada soft delete se eliminan de manera permanente
 */
const Category = require("../models/Category");
const Subcategory = require("../models/SubCategory");
const Products = require("../models/Product");
/**
 * create: crear nuevo producto
 * POST /api/products
 * auth Bearer token requerido
 * Roles: admin y coordinador pueden crear productos
 * body requerido:
 * name: nombre del producto
 * description: descripción del producto
 * subcategory: id de la subcategoria padre a la que pertenece
 * cstegory: id de la categoria a la que pertenece la subcategoria
 * retorna tres posibles mensajes:
 * 201: sub-categoría creada en MongoDB
 * 400: validacion fallida o nombre duplicado
 * 404: subcategoria padre no existe
 * 500: error en base de datos
 */

exports.createProduct = async (req, res) => {
    try{
        const {name, description, price, stock, category, subcategory} = req.body;        
        // ===== VALIDACIONES =====
        // Verificar que todos los campos requeridos esten presentes
        if (!name || !description || !price || !stock || !category || !subcategory) {
            return res.status(400).json({
                success: false,
                message: 'todos los campos son obligatorios',
                requirefields: ['name', 'description', 'price', 'stock', 'category', 'subcategoty']
            });
        }

        // Validar que la categoria exista
        const categoryExist = await Category.findById(category);
        if(!categoryExist) {
            return res.status(404).json({
                success: false,
                message: 'La categoria solicitada no existe',
                categoryId: category
            });
        }

        //Validar que la subcategoria existe y pertenece a la categoria especificada
        const subcategoryExist = await Subcategory.findOne({
            _id: subcategory,
            category: category
        });
        if (!subcategoryExist) {
            return res.status(400).json({
                success: false,
                message: 'La subcategoria no existe o no pertenece a la categoria especificada'
            });
        }
        // ===== CREAR PRODUCTO =====
        const product = new Products({
            name,
            description,
            price,
            stock,
            category,
            subcategory
        });

        // Si hay usuario autenticado, registrar quien creo el producto
        if (req.user && req.user._id) {
            product.createdBy = req.user._id;
        }

        // Guardar en base de datos
        const savedProduct = await product.save();

        // Obtener producto poblado con datos de realciones (populate)
        const productWithDetails = await Products.findById(savedProduct._id)
        .populate('category', 'name')
        .populate('subcategory', 'name')
        .populate('createdBy', 'username email');

        return res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: productWithDetails
        });
    } catch (error) {
        console.error("Error al crear nuevo producto", error);
        // manejo error de duplicado (campo unico)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un producto con ese nombre',
            });
        }
        // Error generico del servidor
        res.status(500).json({
            success: false,
            message: 'Error al crear producto'
        });
    }
};

/**
 * READ: Obtener productos (con filtro de activos/inactivos)
 * GET /api/products
 * query params:
 * - includeInactive = true : Mostrar tambien productos desactivados
 * - Default: Solo productos activos (active: true)
 * 
 * Retorna: Array de productos poblados con categoria y subcategoria
 */

exports.getProducts = async (req, res) => {
    try{
        // Determinar si incluir productos inactivos
        const includeInactive = req.query.uncludeInactive === 'true';
        const activeFilter = includeInactive ? {}: {active: { $ne: false }};

        //Obtener productos con datos relacionados
        const products = await Product.find(activeFilter)
        .populate('category', 'name')
        .populate('subcategory', 'name')
        .sort({ createdAt: -1});

        // Si el usuario es auxiliar, no mostrar informacion de quien lo creó
        if (req.user && req.user.role === 'auxiliar') {
            // Ocultar campo createdBy para usuarios auxiliares

            products.forEach(product => {
                product.createdBy = undefined;
            });
        }

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });        
    } catch (error) {
        console.error('Error al obtener productos', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos',
            error: error.message
        });
    }
};

/**
 * READ obtener un producto especifico por id
 * GET /api/products/:id
 * Retorna: Producto poblado con categoria y subcategoria
 */
exports.getProductById = async (req, res) => {
    try{        
        const product = await Products.findById(req.params.id)
            .populate('category', 'name description')
            .populate('subcategory', 'name description');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'producto no encontrado'
            });
        }
        
        // Ocultar createdBy para usuarios auxiliares
        if (req.user && req.user.role === 'auxiliar') {
            product.createdBy = undefined;
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error al obtener producto por id', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener producto por id',
            error: error.message
        });
    }
};
/**
     * UPDATE Actualiza producto existente
     * PUT /api/products/:id
     * Body: { cualquier campo a actualizar }
     * - Solo actualiza campos enviados
     * - Valida relaciones si se envian category o subcategory
     * - Retorna producto actualizado
     */
    exports.updateProduct = async (req, res) => {
        try {
            const { name, description, price, stock, category, subcategory} = req.body;
            const updateData = {};

            // Agrega solo los campos que fueron enviados
            if (name) updateData.name = name;
            if (description) updateData.description = description;
            if (price) updateData.price = price;
            if (stock) updateData.stock = stock;
            if (category) updateData.category = category;
            if (subcategory) updateData.subcategory = subcategory;

            // Validar relaciones si se actualizan
            if (category || subcategory) {
                if (category) {
                    const categoryExist = await Category.findById(category);
                    if(!categoryExist){
                        return res.status(404).json({
                            success: false,
                            message: 'La categoria solicitada no existe'
                        });
                    }
                }
                
                if (subcategory) {
                    const subcategoryExist = await Subcategory.findOne({
                        _id: subcategory.$necategory,
                         category: category || updateData.category
                    });
                    if (!subcategoryExist) {
                        return res.status(404).json({
                            success: false,
                            message: 'La subcategoria no existe o no pertenece a la categoria'
                        });
                    }
                }
            }
                
            

            // Actualizar producto en BD
            const updateProduct = await Products.findByIdAndUpdate(req.params.id, updateData, {
                new: true,
                runValidators: true
            }).populate('category', 'name')
            .populate('subcategory', 'name')
            .populate('createdBy', 'username email');

            if (!updateProduct) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }            
            res.status(200).json({
                success: true,
                message: 'Producto actualizados exitosamente',
                data: updateProduct
            });
        } catch (error) {
            console.error('Error en actualizar producto', error);
            res.status(500).json({
                success: false,
                message: 'Error al acutalizar el producto',
                error: error.message
            });
        }
    };

    /**
     * DELETE eliminar o desactivar un producto
     * DELETE /api/products/:id
     * Query params:
     * - hardDelete = true : Eliminar permanentemente de la BD
     * - Default: Soft delete (marcar como inactivo)
     * 
     * SOFT DELETE: Solo marca active: false
     * HARD DELETE: Elimina permanentemente el documento
     */
    exports.deleteProduct = async (req, res) => {
        try{            
            const isHardDelete = req.query.hardDelete === 'true';
            const product = await Products.findById(req.params.id);
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'producto no encontrado'
                });
            }

            if (isHardDelete) {
                // ===== HARD DELETE: Eliminar permanentemente de la BD =====
                await Products.findByIdAndDelete(req.params.id);
                res.status(200).json({
                    success: true,
                    message: 'Producto eliminado permanentemente de la base de datos',
                    data: product
                });
            } else {
                // ===== SOFT DELETE: Solo marcar como inactivo =====
                product.active = false;
                await product.save();
                res.status(200).json({
                    success: true,
                    message: 'Producto desactivado exitosamente (soft delete',
                    data: product
                });
            }
        } catch (error) {
            console.error('Error al desactiva el producto', error);
            res.status(500).json({
                success: false,
                message: 'error al eliminar el producto',
                error: error.message
            });
        }
    };