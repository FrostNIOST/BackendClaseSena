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
const categoryController = require('../controllers/subcategoryController');
const {verifyToken} = require('../middlewares/authJwt');
const { checkRole} = require('../middlewares/role')

const validateSubCategory = [
    check('name').not().isEmpty().withmessage('el nombre es obligario'),
    check('description').not().isEmpty().withmessage('la descripcion es obligatoria'),
    check('category').not().isEmpty().withmessage('la categoria es obligatoria'),
]

//rutas CRUD
router.post('/', verifyToken, checkRole(['admin', 'coordinador']), validateSubCategory, subCategoryController.createSubategory);
router.get('/', subcategoryController.getSubCategories);
router.get('/:id', subcategoryController.getSubCategoriesById);
router.put('/:id', verifyToken, checkRole(['admin', 'coordinador']), validateSubCategory, subCategoryController.updateSubCategory);
router.delete('/:id', verifyToken, checkRole('admin'), subCategoryController.deleteSubCategory);

module.exports = router;