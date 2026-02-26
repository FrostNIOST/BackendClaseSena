/**
 * MIDDLEWARE control de roles de usuario
 * 
 * sirve para verificar que el usuario autenticacion tiene permisos necesarios para acceder a una ruta especifica
 * 
 * funcion factory checkRole() permite especificar los roles permitidos
 * funcion Helper para roles especificos iaAdmin, isCoordinador, isAuxiliar
 * requiere qie verifyToken se haya ejecutado primero
 * que verifica que req.userRole exista
 * compara req.userRole contra la lista de permitidos
 * si esta lista continua
 * si no esta en la lista retorna 403 Forbidden con el mensaje descriptivo
 * si no existe userRole retorna 401 Unauthorized (Token corrupto)
 * 
 * uso:
 * checkRole ('admin') solo admin
 * checkRole ('admin', 'coordinador') admin y coordinador
 * checkRole ('admin', 'coordinador', 'auxilair') todos con permisos
 * Roles del sistema:
 * admin: acceso total
 * coordinador: no puede eliminar ni gestionar usuarios
 * auxiliar acceso limitado con tareas especificas
 * 
 */

/**
 * factory function checkRole
 * retorna middleware  que verifica si el usuario tiene uno de los roles permitidos 
 * @param {...string} allowedRoles roles peritidos en el sistema
 * @returns {function} middleware de express 
 * 
 */

const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        //valida que el usuario fue autenticado y verifyToken ejecutado
        //req, userRole es establecido por verifyToken middleware
        if (!req.userRole){
            return res.status(401).json({
                success: false,
                message: 'Token invalido o expirado',
            });
        }

        //

    }
}