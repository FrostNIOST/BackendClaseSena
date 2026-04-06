/**
 * rutas de autenticacion define los endpoints relativos a autenticacion de usaurios
 * POST: /api/auth/signin : registra un nuevo usuario
 */


const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const {verifySingUp} = require('../middlewares');
const {verifyToken} = require('../middlewares/authJwt');
const { checkRole} = require('../middlewares/role');

//rutas de autenticacion

//requiere email-usuario y password
router.post('/signin', authController.signin);
// Registro público para usuarios con rol 'user' (auxiliar)
router.post('/register', verifySingUp.chedkDuplicateUsernameOrEmail, verifySingUp.checkRolesExisted, authController.register);
// Registro administrativo (requiere admin)
router.post('/signup', verifyToken, checkRole(['admin']), verifySingUp.chedkDuplicateUsernameOrEmail, verifySingUp.checkRolesExisted, authController.signup);




module.exports = router;

