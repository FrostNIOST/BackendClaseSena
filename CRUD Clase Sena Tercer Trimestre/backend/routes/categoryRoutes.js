/**
 * Rutas de categoria
 * define los endpoints CRUD para lagestion de categorias
 * las ctaegorias son contenedores padre de las subcategorias y productos
 * endpoints:
 * POST: /api/categories crea una nueva categoria
 * GET: /api/categories obtiene todas las categorias
 * GET: /api/categories/:id obtiene la categoria por id
 * PUT: /api/categories/:id actualiza la categoria por el id
 * DELETE: /api/categories/:id elimina/desactiva una categoria
 * 
 */

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const {verifyToken} = require('../middlewares/authJwt');
const { checkRole} = require('../middlewares/role');

//rutas CRUD
router.post('/', verifyToken, checkRole(['admin', 'coordinador']), categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoriesById);
router.put('/:id', verifyToken, checkRole(['admin', 'coordinador']), categoryController.updateCategory);
router.delete('/:id', verifyToken, checkRole('admin'), categoryController.deleteCategory);

module.exports = router;