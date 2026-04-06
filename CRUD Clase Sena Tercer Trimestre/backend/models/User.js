// modelo de usuario 
/*define la estructura de base de datos para los usuarios
encripta la contraseña
manejo de roles (admin, coordinador, auxiliar)
*/

const mongoose = require ('mongoose');
const bcrypt = require ('bcryptjs');

// Estructura de la base de datos para los usuarios 
const userSchema = new  mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true, //elimina los espacios al inicio y al final
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true, //Convierte a minusculas
        trim: true, // elimina los espacios
        match: [/\S+@\S+\.\S+/, 'El correo no es valido!'] //Valida el patrón email

    },
    //Contraseña requerida, minimo 10 caracteres
    password:{
        type: String,
        required: true,
        minlength: 10,
        select: false,  //no incluye en resultados por defecto    
    },

    //telefono opcional, solo numeros, longitud entre 7 y 15 caracteres
    phone: {
        type: String,
        required: false,
        unique: true,
        trim: true,
        match: [/^\d{7,15}$/, 'El número de teléfono no es válido!'], //valida solo numeros y longitud
    },

    //rol del usuario restringe valores especificos
    role:{
        type: String,
        enum: ['admin', 'coordinador', 'auxiliar', 'user'],
        //valores permitidos
        default: 'user', // por defecto, los nuevos usuarios son auxiliar
    },

    active: {
        type: Boolean,
        default: true, //los nuevos usuarios comienzan activos

    },
},

{
    timestamps: true, // agrega createdAt y apdatedAt automaticamnete
    versionKey: false, // no incluir _v en el contro de versiones de mongoose
});

// Índices explícitos para enforcing unique + sparse para campos opcionales
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ username: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

//Middleware escrita la contraseña antes de guardar el usuario
userSchema.pre('save', async function (next) {
    // Si el password no fue modificado no encripta de nuevo
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        //Encriptar el password con el salt generado
        this.password = await bcrypt.hash(this.password, salt);
        next();        
    }catch (error){
        // si hay error en encriptacion pasar el error al siguiente
        next(error);
    }
});

// crear y exportar el modulo de usuario
module.exports = mongoose.model('User', userSchema);