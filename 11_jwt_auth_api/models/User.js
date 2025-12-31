const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type: String, required: true, default: "user"}
})

// Encriptamos la contraseña antes de guardarla en la BDD
userSchema.pre('save', async function(next) {
    // Si la contraseña no ha sido modificada, no se realizará ninguna acción
    if (!this.isModified('password')) {
        return next();
    };
    // Se crea la salt (token) para agregarlo a la cadena encriptada de la contraseña, para dar fortaleza al encriptado final
    const salt = await bcrypt.genSalt(10);

    // Se encripta la contraseña con la salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);