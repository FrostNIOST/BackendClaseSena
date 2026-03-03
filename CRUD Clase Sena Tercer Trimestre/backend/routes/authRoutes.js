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
router.post('/signin', authController.signIn);
router.post('/signup', verifyToken, checkRole('admin'), verifySingUp.chedkDuplicateUsernameOrEmail, verifySingUp.checkRolesExisted, authController.signUp);




module.exports = router;

