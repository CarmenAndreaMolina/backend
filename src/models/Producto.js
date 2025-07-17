const { Schema, model } = require('mongoose');

const productoSchema = new Schema({
  imagen: { type: String, default: null },
  categoria: { type: String, default: 'Sin categoría' },
  nombreProdu: { type: String, required: true },
  descripcionProdu: { type: String, required: true },
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  precioUnitario: { type: Number, required: true },
  stock: { type: Number, default: 0, min: 0 },
}, {
  timestamps: true,
});

module.exports = model('Producto', productoSchema);
