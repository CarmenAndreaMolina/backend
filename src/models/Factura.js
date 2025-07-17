// models/factura.model.js
const mongoose = require('mongoose');

const detalleProductoSchema = new mongoose.Schema({
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true }
});

const facturaSchema = new mongoose.Schema({
  cliente: { type: String, required: true },
  productos: [detalleProductoSchema],
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Factura', facturaSchema);
