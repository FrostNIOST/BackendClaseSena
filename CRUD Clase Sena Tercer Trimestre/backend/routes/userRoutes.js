/**
 * rutas del usuario
 * define los endpoints para la gestion de usuarios en el sistema
 * POST: /api/users crea una nuevo usuario
 * GET: /api/users obtiene todas los usuario
 * GET: /api/users/:id obtiene la usuario por id
 * PUT: /api/users/:id actualiza la usuario por el id
 * DELETE: /api/users/:id elimina/desactiva un usuario
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {verifyToken} = require('../middlewares/authJwt');
const { checkRole} = require('../middlewares/role');

router.use ((req, res, next) =>{
    console.log('\n=== DIAGNOSTICO DE FR RUTA ===')
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.log(`Headers: `, {'Authorization': req.headers.authorization ? '***' + req.headers.authorization.slice(8): null, 'x-access-token': req.headers['x-access-token'] ? '***' + req.headers['x-access-token'].slice(8): null, 'user-agent': req.headers['user-agent']});
    next();  
    
});

//rutas CRUD
router.post('/', verifyToken, checkRole(['admin', 'coordinador']), userController.createUser);
router.get('/', verifyToken, checkRole(['admin', 'coordinador', 'auxiliar']), userController.getAllUsers);
router.get('/:id', verifyToken, userController.getUserById);
router.put('/:id', verifyToken, checkRole(['admin', 'coordinador', 'auxiliar']), userController.updateUser);
router.delete('/:id', verifyToken, checkRole('admin'), userController.deleteUser);

module.exports = router;


