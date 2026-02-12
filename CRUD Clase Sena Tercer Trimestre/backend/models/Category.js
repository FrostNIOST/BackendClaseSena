/**
 * modelo de categoria MongoDB
 * define la estructura de la categoria
*/

const mongoose = require ('mongoose');
const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'el nombre es obligario'],
        unique: true,
        trim: true,

    },
    
    descripcion:{
        type: String,
        required: [true, 'la descripcion es requerida'],
        unique: true,
        trim: true,

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

caterorySchema.pre('save', async function (next) {
    try{
        //obtener referencia de la coleccion de MongoDB
        const collection = this.constructor.collection;

        //obtener lista de todos los indices
        const indexes = await collection.indexes();

        //buscar si existe el indice problematico con nombre "name_1"
        //(del orden: 1 significa asendente)
        const problematicIndex = indexes.find(index =>
            index.name === 'name_1'
        );

        //si lo encuentra, eliminarlo
        if (problematicIndex){
            await collection.dropIndex('name_1');

        }
    }catch(err){
        //si el error es index no found no es el problema - continuar 
        //si es otro error pasarlo a la siguiente middleware
        if (!err.message.includes('index no found')){
            return next(err);
        }
    }
    // Continuar con el guardado
    next();
    
});

/**
 * crear indice unico 
 * 
 * Mongo rechaza cualquier intento de insertar o actualizar un documento con un valor de name que ya exista
 * aumenta la velocidad de las busquedas
 */

categorySchema.index({name: 1} ,{
    unique: true,
    name: 'name_1', //nombre explicito para evitar conflictos

});

module.exports = mongoose.model('Category', categorySchema)