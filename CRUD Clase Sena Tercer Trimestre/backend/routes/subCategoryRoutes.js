/**
 * Rutas de categoria
 * define los endpoints CRUD para lagestion de categorias
 * las subcategorias son contenedores padre de las subcategorias y productos
 * endpoints:
 * POST: /api/subcategories crea una nueva categoria
 * GET: /api/subcategories obtiene todas las categorias
 * GET: /api/subcategories/:id obtiene la categoria por id
 * PUT: /api/subcategories/:id actualiza la categoria por el id
 * DELETE: /api/subcategories/:id elimina/desactiva una categoria
 * 
 */

const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const subCategoryController = require('../controllers/subcategoryController');
const {verifyToken} = require('../middlewares/authJwt');
const { checkRole} = require('../middlewares/role')

const validateSubCategory = [
    check('name').not().isEmpty().withMessage('el nombre es obligario'),
    check('description').not().isEmpty().withMessage('la descripcion es obligatoria'),
    check('category').not().isEmpty().withMessage('la categoria es obligatoria'),
]

//rutas CRUD
router.post('/', verifyToken, checkRole(['admin', 'coordinador']), validateSubCategory, subCategoryController.createSubategory);
router.get('/', verifyToken, subCategoryController.getSubcategories);
router.get('/:id', verifyToken, subCategoryController.getSubcategoriesById);
router.put('/:id', verifyToken, checkRole(['admin', 'coordinador']), validateSubCategory, subCategoryController.updateSubcategory);
router.delete('/:id', verifyToken, checkRole(['admin']), subCategoryController.deleteSubcategory);

module.exports = router;