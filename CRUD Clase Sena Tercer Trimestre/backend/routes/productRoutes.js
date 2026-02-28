/**
 * Rutas de categoria
 * define los endpoints CRUD para la gestion de los productos
 * los productos son contenedores padre de las subcategorias y productos
 * endpoints:
 * POST: /api/products crea una nuevo producto
 * GET: /api/products obtiene todas los producto
 * GET: /api/products/:id obtiene la producto por id
 * PUT: /api/products/:id actualiza la producto por el id
 * DELETE: /api/products/:id elimina/desactiva un producto
 * 
 */

const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const productController = require('../controllers/productController');
const {verifyToken} = require('../middlewares/authJwt');
const { checkRole} = require('../middlewares/role');

const validateProduct = [
    check('name').not().isEmpty().withmessage('el nombre es obligario'),
    check('price').not().isEmpty().withmessage('el precio es obligatorio'),
    check('stock').not().isEmpty().withmessage('el stock es obligatorio'),
    check('category').not().isEmpty().withmessage('la categoria es obligatoria'),
    check('subCategory').not().isEmpty().withmessage('la subcategoria es obligatoria'),
    
];

//rutas CRUD
router.post('/', verifyToken, checkRole(['admin', 'coordinador', 'auxiliar']), validateProduct, productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', verifyToken, checkRole(['admin', 'coordinador']), validateProduct, productController.updateProduct);
router.delete('/:id', verifyToken, checkRole('admin'), productController.deleteProduct);

module.exports = router;