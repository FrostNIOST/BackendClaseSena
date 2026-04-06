/** 
 * controlador de wishlist
 * este modulo maneja todas las operaciones del crud para la gestion de wishlist
 * seguridad:
 * validacion para que no se pueda cambiar el id del usuario en la wishlist
 * esto asegura que cada wishlist este siempre asociada al usuario correcto
 * y evita problemas de integridad de datos si el id del usuario se cambiara accidentalmente
 * no se puede borrar ni desactivar una wishlist, solo agregar o quitar productos
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
const Product = require('../models/Product');
const User = require('../models/User');


/**
 * ADD agregar un producto a la wishlist
 * PUT /api/wishlist/:id
 * auth bearer token requerido
 * validaciones:
 * la cantidad debe ser minimo 1
 * no debe afectar el stock del producto, la wishlist es una lista de deseos, no una reserva
 * respuestas:
 * 200: producto agregado exitosamente a la wishlist
 * 400: cantidad no valida o producto no disponible
 * 404: producto no encontrado
 * 500: error de servidor
 */

exports.addWishlistItem = async (req, res) => {
    try {

    }catch (error) {
        console.error('CONTROLLER Error en addWishlistItem:', error);
        res.status(500).json({
            success: false,
            message: 'Error al agregar item a la wishlist',
        });
    }
}