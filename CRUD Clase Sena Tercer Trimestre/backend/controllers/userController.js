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


exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        //crear usuario nuevo
        const user = new User({
            username,
            email,
            password,
            role,
        });


        //guardar en la base de datos
        const savedUser = await user.save();

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                role: savedUser.role,
            }
        });


    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear usuario',
            error: error.message,
        });
    }
};


/**
 * UPDATE actualziar un usuario existosamente
 * PUT /api/users/:id
 * auth bearer token requerido
 * validaciones
 * auxiliar solo puede actualziar su propio perfil
 * auxiliar no puede cambiar su rol
 * admin, coordinador pueden actualizar otros usuarios
 * respuestas:
 * 200: usuario actualizado
 * 403: acceso denegado, sun permiso para actualizar (auxiliar intentando acceder a otro usuario)
 * 404: usuario no encontrado
 * 500: error de servidor
 */



exports.updateUser = async (req, res) => {
    try {

        //restriccion: axiliar solo puede actualizar su propio perfil

        if (req.userRole === 'auxiliar' && req.userId.toString() !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para actualizar este usuario',
            });
        }


        //restriccion: auxiliar no puede cambiar su propio rol

        if (req.userRole === 'auxiliar' && req.body.role) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para modificar tu rol',
            });
        }

        //actualizar usuario
        const updateUser = await User.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true }, //retorna documento actualizado

        ).select('-password'); //no retorna la contraña

        if (!updateUser) {
            return res.status(404).json({
                success: false,
                message: 'usuario no encontrado',

            });
        }
        res.status(200).json({
            success: true,
            message: 'Usuario actualizado',
            user: updateUser,
        });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar usuario',
            error: error.message,
        });
    }
};


/**
 * DELETE user eliminar un usuario existosamente
 * delete /api/users/:id
 * roles: admin
 * query params:
 * hardDelete= true eliminar permanente
 * default soft delete desactivar
 * auth bearer token requerido 
 * el admin solo puede desactivar otros admin
 * respuestas:
 * 200: usuario actualizado
 * 403: acceso denegado, sin permiso para eliminar o desactivar (auxiliar intentando acceder a otro usuario)
 * 404: usuario no encontrado
 * 500: error de servidor
 */





exports.deleteUser = async (req, res) => {
    try {

        const isHardDelete = req.query.hardDelete === 'true';

        const userToDelete = await User.findById(req.params.id);


        if (!userToDelete) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        //proteccion no permitir desactivar otros admin
        //solo el admin puede desactivar o eliminar otro admin


        if (userToDelete.role === 'admin' && userToDelete._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para eliminar o desactivar administradores',
            
            });
        }

        //desactiva al usuario

        if (isHardDelete){
            //elimina el usuario permanentemente
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Usuario eliminado permanentemente',
                data: userToDelete,
            });
        }else{
            //softDelete
            userToDelete.active = false;
            await userToDelete.save();

            res.status(200).json({
                success: true,
                message: 'Usuario desactivado',
                data: userToDelete,
            });
        }

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar usuario',
            error: error.message,
        });
    }
};

