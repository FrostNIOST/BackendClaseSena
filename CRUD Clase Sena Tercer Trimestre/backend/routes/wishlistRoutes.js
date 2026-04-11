/**
 * Rutas de categoria
 * define los endpoints CRUD para la gestion de los productos
 * los productos son contenedores padre de las subcategorias y productos
 * endpoints:
 * GET: /api/wishlist obtiene todas las wishlists
 * GET: /api/wishlist/:id obtiene una wishlist por id
 * PUT: /api/wishlist/:id actualiza una wishlist por el id
 * DELETE: /api/wishlist/:id elimina/desactiva una wishlist
 * 
 */
const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const {verifyToken} = require('../middlewares/authJwt');
const { checkRole} = require('../middlewares/role');

router.get('/', verifyToken, checkRole(['admin', 'coordinador', 'auxiliar', 'user']), wishlistController.getWishlist);
router.get('/:id', verifyToken, checkRole(['admin', 'coordinador', 'auxiliar', 'user']), wishlistController.getWishlistById);
router.put('/', verifyToken, checkRole(['admin', 'coordinador', 'auxiliar', 'user']), wishlistController.addWishlistItem);

module.exports = router;
