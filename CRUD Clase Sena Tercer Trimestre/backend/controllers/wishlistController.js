/** 
 * controlador de wishlist
 * este modulo maneja todas las operaciones del crud para la gestion de wishlist
 * seguridad:
 * validacion para que no se pueda cambiar el id del usuario en la wishlist
 * esto asegura que cada wishlist este siempre asociada al usuario correcto
 * y evita problemas de integridad de datos si el id del usuario se cambiara accidentalmente
 * no se puede borrar ni desactivar una wishlist, solo agregar o quitar productos
 * las cantidades se manejan en el carrito no en la wishlist
 * respuestas:
 * 403: no autorizado para modificar el id del usuario en la wishlist
 * 500: error de servidor
 * las contrasenas nunca se devuelven en respuestas

 * 
 * operaciones:
 * getWishlist: obtener lista de wishlists de un usuario (debe mostar si el item esta en stock o no)
 * getWishlistById: obtener detalles de una wishlist por su id
 * addWishlistItem: agregar un producto a la wishlist
 * removeWishlistItem: quitar un producto de la wishlist
 * deleteWishlistItem: eliminar un producto de la wishlist (solo para administradores, no se puede eliminar un item de la wishlist de un usuario, solo desactivarlo)
 * deleteWishlist:nadie puede eliminar una wishlist, solo agregar o quitar productos, la wishlist siempre existe mientras el usuario exista
 * 
*/
const Wishlist = require('../models/Wishlist');
/**
 * (get)getWishlist obtener la wishlist del usuario autenticado
 * GET /api/wishlist
 * auth bearer token requerido
 */
exports.getWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        //buscar la wishlist activa del usuario
        const wishlist = await Wishlist.findOne({ id_user: userId, active: true })
            .populate("products.Product");
        //saber como se esta enviando la consulta a la base de datos, si el id_user se esta enviando como string o como ObjectId, esto es importante para que la consulta funcione correctamente
        if (!wishlist) {
            return res.status(404).json({ success: false, message: 'Wishlist no encontrada' });
        }

        const items = wishlist.products.map(p => ({
            id: p._id,
            nombre: p.name,
            precio: p.price,
            inStock: p.stock > 0,
        }));

        res.status(200).json({ success: true, data: { wishlistId: wishlist._id, products: items } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener la wishlist', error: error.message });
    }

}

/**
 * (get)getWishlistById obtener detalles de una wishlist por su id
 * GET /api/wishlist/:id
 * auth bearer token requerido
 */

exports.getWishlistById = async (req, res) => {
    try {
        const wishlistId = req.params.id;
        const userId = req.userId;
        const userWishlist = await Wishlist.findById(wishlistId).populate("products.Product");
        console.log('CONTROLLER getWishlistById - userId:', userId, 'wishlistId:', wishlistId, 'userWishlist:', userWishlist);

        if (!userWishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist no encontrada',
            });
        }

        // Verificar si el usuario autenticado es el propietario o es admin
        if (userWishlist.id_user.toString() !== userId && req.userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'No autorizado para ver esta wishlist',
            });
        }

        const items = userWishlist.products.map(p => ({
            id: p._id,
            nombre: p.name,
            precio: p.price,
            inStock: p.stock > 0,
        }));

        res.status(200).json({
            success: true,
            data: {
                wishlistId: userWishlist._id,
                products: items
            }
        });

    } catch (error) {
        console.error('CONTROLLER Error en getWishlistById:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la wishlist',
            error: error.message,
        });
    }
}


/**
 * (ADD)addWishlistItem agregar un producto a la wishlist
 * PUT /api/wishlist/:id
 * auth bearer token requerido
 * validaciones:
 * no se pude repetir el mismo producto en la wishlist, si el producto ya esta en la wishlist
 * no debe afectar el stock del producto, la wishlist es una lista de deseos, no una reserva
 * respuestas:
 * 200: producto agregado exitosamente a la wishlist
 * 400: cantidad no valida o producto no disponible
 * 403: no autorizado para modificar el id del usuario en la wishlist
 * 404: wishlist no encontrada
 * 500: error de servidor
 */

exports.addWishlistItem = async (req, res) => {
    try {
        const userId = req.userId; // Obtener el ID del usuario autenticado
        const { productId } = req.body;

        const wishlist = await Wishlist.findOneAndUpdate(
            { id_user: userId },
            { $addToSet: { products: productId } }, // Agrega el producto a la wishlist sin duplicados
            { new: true, upsert: true }, // Devuelve la wishlist actualizada, crea si no existe
        ).populate("products");



        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist no encontrada para el usuario',
            });
        }

        if (!wishlist.products.some(product => product._id.toString() === productId)) {
            return res.status(400).json({
                success: false,
                message: 'Producto no agregado a la wishlist, puede que ya esté en la lista',
            });
        }

        //los auxiliares, user y coordinador solo pueden modificar y ver su propia wishlist
        if (req.userRole !== 'admin' && wishlist.id_user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'No autorizado para modificar esta wishlist',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Agregado a la wishlist exitosamente',
            data: {
                wishlist: wishlist
            }
        });



    } catch (error) {
        console.error('CONTROLLER Error en addWishlistItem:', error);
        res.status(500).json({
            success: false,
            message: 'Error al agregar item a la wishlist',
            error: error.message,
        });
    }
},

    /**
     * (REMOVE)removeWishlistItem: quitar un producto de la wishlist
     * PUT /api/wishlist/:id
     * auth bearer token requerido
     * validaciones:
     * no se pude repetir el mismo producto en la wishlist, si el producto ya esta en la wishlist
     * no debe afectar el stock del producto, la wishlist es una lista de deseos, no una reserva
     * respuestas:
     * 200: producto agregado exitosamente a la wishlist
     * 400: cantidad no valida o producto no disponible
     * 403: no autorizado para modificar el id del usuario en la wishlist
     * 404: wishlist no encontrada
     * 500: error de servidor
     */


    exports.removeWishlistItem = async (req, res) => {
        try {
            const userId = req.userId; // Obtener el ID del usuario autenticado
            const { productId } = req.body;

            const wishlist = await Wishlist.findOneAndUpdate(
                { id_user: userId },
                { $pull: { products: productId } }, // Quita el producto de la wishlist
                { new: true }, // Devuelve la wishlist actualizada
            ).populate("products");

            if (!wishlist) {
                return res.status(404).json({
                    success: false,
                    message: 'Wishlist no encontrada para el usuario',
                });
            }

            //los auxiliares, user y coordinador solo pueden modificar y ver su propia wishlist
            if (req.userRole !== 'admin' && wishlist.id_user.toString() !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'No autorizado para modificar esta wishlist',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Item quitado de la wishlist exitosamente',
                data: {
                    wishlist: wishlist
                }
            });

        } catch (error) {
            console.error('CONTROLLER Error en removeWishlistItem:', error);
            res.status(500).json({
                success: false,
                message: 'Error al quitar item de la wishlist',
            });
        }
    }
