// models/Mensaje.js
const { Schema, model } = require('mongoose');

const mensajeSchema = new Schema({
  emisor: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  receptor: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  contenido: { type: String, required: true },
  leido: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = model('Mensaje', mensajeSchema);
