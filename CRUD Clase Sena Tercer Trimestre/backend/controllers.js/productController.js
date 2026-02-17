/**
 * debe tener los 3 modelos relacionados, categoria, subcategoria y producto, para manejar las relaciones entre ellos
 * debe tener las funciones de CRUD para cada modelo, con validaciones y manejo de errores adecuado
 *  
 */



/**
 * create: crear nuevo producto
 * POST /api/product
 * Auth bearer token requerido 
 * Roles: admin y coordinador 
 * body requerido:
 * name nombre del producto
 * descripcion: descripcion de la producto
 * retorna:
 * 201: producto creado en MongoDB
 * 400: validacion fallida o nombre duplicado
 * 500: error de la base de datos
 *  
 */