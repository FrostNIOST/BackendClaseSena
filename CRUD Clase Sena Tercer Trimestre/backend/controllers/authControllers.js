/**
 * Controlador de autenticacion
 * maneja el registro del login y generacion de tokens JWT
 */

const User = require ('../models/User');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
const config = require ('../config/auth.config');


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
    try{
        //crea nuevo usuario
        const user = new User ({
            username: req.body.password,
            email: req.body.email,
            role: req.body.role || 'auxiliar' //por defecto el rol es auxiliar
            
        });

        //guardar en base de datos
        // la contraseña se encripta automaticamente en middleware del modelo
        const savedUser = await user.save();
        const token = jwt.sign({
            id: savedUser._id,
            role: savedUser.role,
            email:savedUser.email,
        },
        config.secret,
        {expiresIn: config.jwtExpiration}
    );

    //preparando respuesta sin mostrar conteraseña

    const UserResponse ={
        id: savedUser._id,
        username: savedUser.username,
        email:savedUser.email,
        role: savedUser.role,
    };

    res.status(200).json({
        success: true,
        message: 'Usuario registrado correctamente',
        token: token,
        user: UserResponse,

    });
    
    }catch(error){
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

exports.signin = async (req, res) =>{
    try{
        //validar que se envie el email o username
        if (!req.body.email && !req.body.username){
            return res.status(400).json({
                success:false,
                message: 'Email o username requerido',
            });
        }

        //validar que se envie la contraseña correcta
        if (!req.body.password){
            return res.status(400).json({
                success: false,
                message: 'Password requerido',
            });
        }

        // busca el usuario por email o por username
        const user = await User.findOne({
            $or:[
                {username: req.body.username},
                {email: req.body.email},

            ]
        }).select('+password'); // include password field
        //si no encuentra el usuariocon este email o username
        if (!user){
            return res.status(404).json({
                success: false,
                message: 'usuario no encontrado',
            });
        }

        //Verificar que el usuario tenga conraseña
        if (!user.password){
            return res.status (500).json({
                success: false,
                message: 'Error interno: usuario sin contraseña',
            });

        }

        //comparar la contraseña emviada con el hash alamecenado
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid){
            return res.status (401).json({
                success: false,
                message: 'Contraseña incorrecta',
            });
        }

        //Genera token JWT 24 horas
        const token = jwt.sign({
            id: user._id,
            role: user.role,
            email: user.email,

        },
        config.secret,
        {expiresIn: config.jwtExpiration}
    );

    // prepara respuesta sin mostrar contraseña 
    const UserResponse = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
    };
    res.status(200).json({
        success: true,
        message: 'inicio de sesion exitoso',
        token:token,
        user: UserResponse,

    }); 

    }catch(error){
        return res.status(500).json({
            success: false,
            message: 'Error al iniciar sesion',
            error: error.message,
        });
    }
}
