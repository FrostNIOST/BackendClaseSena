/**
 * modelo de subCategoria MongoDB
 * define la estructura de la producto
 * el producto depende de una subcategoria depende de una categoria
 * muchos productos pueden pertenecer a una subcategoria
 * tienen relacion un user para ver quien creo el producto
 * soporte de imagenes (array de url)
 * validacion de valores numericos (no negativos)
*/

const mongoose = require ('mongoose');
//campos de la tabla
const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'el nombre es obligario'],
        unique: true, //no puede haber dos productos con el mismo nombre
        trim: true,

    },
    
    //precio en unidades monetarias
    //nopuede ser negativo
    price:{
        type: Number,
        required: [true, 'El precio es obligatorio'],
        unique: true,
        min: [0, 'El precio no puede ser negativo'],

    },

    stock:{
        type: Number,
        required: [true, 'El stock es obligatorio'],
        min: [0, 'El stock no puede ser negativo'],
    },

    //categoria padre esta subcategoria pertenece a una cataegoria 
    // relacion 1 - muchos una categoria puede tener muchas subcategorias
    //un producto pertenece a una subacategoria, pero una subacategoria puede tener muchos productos uno a muchos

    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', //puede ser poblado con .populate ('category')
        required: [true, 'La categoria es requerida']

    },

        subCategory:{
        type: mongoose.Schema.Types.ObjectId,
        //type: String,
        ref: 'Subcategory', //puede ser poblado con .populate ('subcategory')
        required: [true, 'La Subcategoria es requerida']

    },

    //quien creo el producto
    //referencia de user no requerido
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //puede ser poblado con .populate ('subcategory') 
    },

    //Arays de los URLs de las imagenes de los productos
    images: [{
        type: String, //url de la imagen

    }],

    // activa el producto pero no lo elimina
    active:{
        type: Boolean,
        default: true,        

    },
},{
    timestamps: true,
    versionKey: false,

});

/**
 * MIDDLEWARE PRE-SAVE
 * limpia indices duplicados
 * Mongodb a veces crea multiples indices con el mismo nombre
 * esto causa conflictos la intentar DropIndex o recrear indices 
 * este middleware limpia los indices problematicps 
 * proceso
 * 1 obtiene una lista de todos los indices de la coleccion
 * 2 busca si existe, lo elimina amtes de nuevas operacions 
 * ignora errores si el indice no existe
 * continua con el guardado normal
 */

productSchema.post('save', async function (error, docs, next) {
        //verifica si es erro de mongodb por violacion de indice unico

        if (error.name === 'MongoServerError' && error.code === 11000){
           return next (new  Error ('Ya existe un producto con ese nombre'))
            

        }
        next(error);
    }   
    
);

/**
 * crear indice unico 
 * 
 * Mongo rechaza cualquier intento de insertar o actualizar un documento con un valor de name que ya exista
 * aumenta la velocidad de las busquedas
 */


module.exports = mongoose.model('Product', productSchema);