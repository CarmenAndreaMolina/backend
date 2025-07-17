const mongoose = require('mongoose');

const ordenSchema = new mongoose.Schema({
  comprador: {
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    direccion: { type: String, required: true }
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: false // pon true si gestionas autenticación
  },
  items: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
      cantidad: { type: Number, required: true, min: 1 }
    }
  ],
  total: {
    type: Number,
    required: false
  },
  comentario: {
    type: String
  },
  comprobanteUrl: {
    type: String
  },
  estado: {
    type: String,
    enum: ['pendiente', 'aprobada', 'rechazada'],
    default: 'pendiente'
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Orden', ordenSchema);
