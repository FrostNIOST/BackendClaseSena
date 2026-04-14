/**
 * Controlador de autenticacion
 * maneja el registro del login y generacion de tokens JWT
 */

const User = require('../models/User');
const Wishlist = require('../models/Wishlist');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');


/**
 * SignUp: crear nuevo usuario
 * POST /api/auth/signup
 * Body (username, mail, password, role)
 * crea usuario en la base de datos 
 * encripta contraseña antes de guardar con bcrypt
 * genera token jwt
 * retorna usuario sin mostrar contraseña
 */

exports.signup = async (req, res) => {
    try {
        //normaliza campos para evitar envío en español o inglés
        const phone = req.body.phone || req.body.telefono;

        //crea nuevo usuario
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            phone,
            password: req.body.password,
            role: req.body.role || 'user' //por defecto el rol es auxiliar

        });

        //guardar en base de datos
        // la contraseña se encripta automaticamente en middleware del modelo
        const savedUser = await user.save();
        const token = jwt.sign({
            id: savedUser._id,
            role: savedUser.role,
            email: savedUser.email,
            phone: savedUser.phone,
        },
            config.secret,
            { expiresIn: config.jwtExpiration }
        );

        //preparando respuesta sin mostrar conteraseña

        const UserResponse = {
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            phone: savedUser.phone,
            role: savedUser.role,
        };

        res.status(200).json({
            success: true,
            message: 'Usuario registrado correctamente',
            token: token,
            user: UserResponse,

        });

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(409).json({
                success: false,
                message: `Ya existe un usuario con ese ${field}`,
                error: error.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: error.message,
        });
    }
};

/**
 * Register: registro público para usuarios con rol 'user'
 * POST /api/auth/register
 * Body (username, email, password, phone)
 * Crea usuario con rol 'user' automáticamente
 */

exports.register = async (req, res) => {
    try {
        //normaliza campos para evitar envío en español o inglés
        const phone = req.body.phone || req.body.telefono;

        //crea nuevo usuario con rol fijo 'user'
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            phone,
            password: req.body.password,
            role: 'user' //rol fijo para registro público

        });

        //guardar en base de datos
        const savedUser = await user.save();
        //cuando se  crea un nuevo usuario se crea una wishlist vacia para ese usuario
        await Wishlist.create({
            id_user: savedUser._id,
            products: []
        });
        
        const token = jwt.sign({
            id: savedUser._id,
            role: savedUser.role,
            email: savedUser.email,
            phone: savedUser.phone,
        },
            config.secret,
            { expiresIn: config.jwtExpiration }
        );

        //preparando respuesta sin mostrar contraseña
        const UserResponse = {
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            phone: savedUser.phone,
            role: savedUser.role,
        };

        res.status(200).json({
            success: true,
            message: 'Usuario registrado correctamente',
            token: token,
            user: UserResponse,

        });

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(409).json({
                success: false,
                message: `Ya existe un usuario con ese ${field}`,
                error: error.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: error.message,
        });
    }
};


/**
 * sign: iniciar sesion
 * POST /api/auth/signin
 * Body (username, mail, password)
 * busca el usuario por email o username
 * valida la contraseña con bcrypt
 * si es correcto el token jwt
 * token se usa para autenticar futuras solicitudes
 */

exports.signin = async (req, res) => {
    try {
        //validar que se envie el email o username
        if (!req.body.email && !req.body.username && !req.body.phone) {
            return res.status(400).json({
                success: false,
                message: 'Email, username o teléfono requerido',
            });
        }

        //validar que se envie la contraseña correcta
        if (!req.body.password) {
            return res.status(400).json({
                success: false,
                message: 'Password requerido',
            });
        }

        // Normalizar valores para búsqueda
        const username = req.body.username ? req.body.username.trim() : null;
        const phone = req.body.phone ? req.body.phone.trim() : null;
        const email = req.body.email ? req.body.email.trim().toLowerCase() : null;

        // Crear criterios de búsqueda sólo para los campos que fueron enviados
        const criteria = [];
        if (username) criteria.push({ username });
        if (phone) criteria.push({ phone });
        if (email) criteria.push({ email });

        if (criteria.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Debe enviar email, username o teléfono válido para iniciar sesión',
            });
        }

        const user = await User.findOne({
            $or: criteria,
        }).select('+password'); // include password field

        //si no encuentra el usuario con este email o username o telefono
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'usuario no encontrado',
            });
        }

        //Verificar que el usuario tenga conraseña
        if (!user.password) {
            return res.status(500).json({
                success: false,
                message: 'Error interno: usuario sin contraseña',
            });

        }

        //comparar la contraseña emviada con el hash alamecenado
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Contraseña incorrecta',
            });
        }

        //Genera token JWT 24 horas
        const token = jwt.sign({
            id: user._id,
            role: user.role,
            email: user.email,
            phone: user.phone,

        },
            config.secret,
            { expiresIn: config.jwtExpiration }
        );

        // prepara respuesta sin mostrar contraseña 
        const UserResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
        };
        res.status(200).json({
            success: true,
            message: 'inicio de sesion exitoso',
            token: token,
            user: UserResponse,

        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al iniciar sesion',
            error: error.message,
        });
    }
}
