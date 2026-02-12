/**
 * modelo de subCategoria MongoDB
 * define la estructura de la SubCategoria
 * La SubCategoria depende de una categoria
 * muchs productos pueden pertenecer a una subcategoria
 * muchas subcategorias dependen de una sola categoria
*/

const mongoose = require ('mongoose');
const subcategorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'el nombre es obligario'],
        unique: true, //nop uede haber dos subcategorias con el mismo nombre
        trim: true,

    },
    
    descripcion:{
        type: String,
        required: [true, 'la descripcion es requerida'],
        unique: true,
        trim: true,

    },

    //categoria padre esta subcategoria pertenece a una ctaegoria 
    // relacion 1 - muchos una categoria puede tener muchas subcategorias
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', //puede ser poblado con .populate ('category')
        required: [true, 'La categoria es requerida']

    },


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

subcategorySchema.post('save', async function (error, docs, next) {
        //verifica si es erro de mongodb por violacion de indice unico

        if (error.name === 'MongoServerError' && error.code === 1000){
            next(new Error ('ya existe una subcategoria con ese nombre'));
            

        }else{
            // pasa el error como es
            next(error);
        }
    }   
    
);

/**
 * crear indice unico 
 * 
 * Mongo rechaza cualquier intento de insertar o actualizar un documento con un valor de name que ya exista
 * aumenta la velocidad de las busquedas
 */


module.exports = mongoose.model('Subcategory', subcategorySchema);