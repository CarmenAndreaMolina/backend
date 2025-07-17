const { Schema, model } = require('mongoose');

const usuarioSchema = new Schema({
  imagen: { type: String, default: null },
  nombre: String,
  apellido: String,
  edad: Number,
  telefono: Number,
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String }, // ya no required
  google: { type: Boolean, default: false }, // nuevo campo para identificar usuarios Google
  rol: { type: String, enum: ['cliente', 'vendedor', 'admin'], default: 'cliente' }
}, {
  timestamps: true
});

module.exports = model('Usuario', usuarioSchema);


