const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, default: 1 },
});

const carritoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, unique: true },
  items: [itemSchema],
});

module.exports = mongoose.model('Carrito', carritoSchema);
