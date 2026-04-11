/**
 * modelo de la wishlist MongoDB
 * define la estructura de la Wishlist
 * La Wishlist depende de un usuario
 * muchos productos pueden pertenecer a una wishlist
 */

const mongoose = require ('mongoose');
const wishlistSchema = new mongoose.Schema({
    id_user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //puede ser poblado con .populate ('user')
        required: [true, 'el usuario es obligatorio'],
        trim: true,

    },
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', //puede ser poblado con .populate ('products')
    }],
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

wishlistSchema.pre('save', async function (error, next){
    if (error.name === 'MongoError' && error.code === 11000) {
        try {
            const indexName = Object.keys(error.keyValue)[0] + '_1';
            await this.collection.dropIndex(indexName);
        } catch (err) {
            console.error('Error al eliminar el índice duplicado:', err);
        }

    }
});

module.exports = mongoose.model('Wishlist', wishlistSchema);