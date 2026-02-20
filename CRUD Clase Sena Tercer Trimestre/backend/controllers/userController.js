/** 
 * controlador de usuarios 
 * este modulo maneja todas las operaciones del crud para la gestion de usuarios
 * incluye control de acceso basado en roles 
 * seguridad
 * las contrasenas nunca se devuelven en respuestas
 * los auxiliares no pueden ver y adcutalizar otros usuarios 
 * los coordinadores no pueden ver los administradores
 * activar y desactivar usuarios
 * eliminar permanentemente un usuario (solo admin)
 * 
 * operaciones:
 * getAllUsers: obtener lista de usuarioscon filtro por el rol
 * getUserById: obtener detalles de un usuario por su id
 * createUser: crear nuevo usuario con su validacion
 * updateUser: actualizar datos de un usuario con validacion y control de acceso
 * deleteUser: eliminar un usuario permanentemente (solo admin) o desactivar un usuario (admin y coordinador)
 * 
 * 
*/


const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * obtener la lista de usuarios
 * GET /api/users
 * Auth bearer token requerido
 * query params incluir activo o desactivados 
 * 
 * retorna 200 array de usuarios filtrados
 * 500 error de servidor
 */

exports.getAllUsers = async (req, res) => {
    try {
        const includeInactive = req.query.includeInactive === 'true';
        const activeFilter = includeInactive ? {} : { active: { $ne: false } };

        let users;

        //control de acceso basado en roles
        if (req.userRole === 'auxiliar') {
            //los auxiliares solo pueden ver su propio usuario
            users = await User.find({ _id: req.userId, ...activeFilter }).select('-password');
        } else {
            //los admin y los coordinadores ven todos los usuarios
            users = await User.find(activeFilter).select('-password');

        }
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error('CONTROLLER Error en getAllUsers:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener todos los uaurios',
        });
    }
};

/** 
 * Read obtener un usuario por su id
 * GET /api/users/:id
 * Auth bearer token requerido
 * repuesta:
 * 200: usuario encontrado
 * 403: acceso denegado (auxiliar intentando acceder a otro usuario)
 * 404: usuario no encontrado
 * 500: error de servidor
 */


exports.getUserById = async (req, res) => {
    try {
        const user = await user.findById(req.params.id).select('-password');



        if (!user) {
            //los auxiliares solo pueden ver su propio usuario
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }
        res.status(200).json({
            success: true,
            data: user,
        });
        //validaciopnes de acceso
        //los auxiliares solo pueden ver su propio usuario
        if (req.userRole === 'auxiliar' && req.userId !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado',
            });

        }
        res.status(200).json({
            success: true,
            data: user,
        });

        //validaciopnes de acceso
        //los coordinadores no pueden ver los administradores
        if (req.userRole === 'coordinador' && req.userId !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado, no puedes ver los administradores',
            });

        }
        res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        console.error('Error en getUserById:', error);
        res.status(500).json({
            success: false,
            message: 'Error al encontrar usuario',
        });
    }
};