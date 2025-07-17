const mongoose = require('mongoose');

const detalleVentaSchema = new mongoose.Schema({
  productoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  precioUnitario: {
    type: Number,
    required: true
  },
  cantidad: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  }
});

const ventaSchema = new mongoose.Schema({
  cliente: {
    nombre: { type: String, required: true },
    correo: { type: String, required: true }
  },
  productos: [detalleVentaSchema],
  total: {
    type: Number,
    required: true
  },
  fechaVenta: {
    type: Date,
    default: Date.now
  },
  registradoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario', // si usas sistema de login/admin
    required: false
  }
});

module.exports = mongoose.model('Venta', ventaSchema);
