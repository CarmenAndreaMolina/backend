const { Schema, model, Types } = require('mongoose');

const ofertaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    maxlength: 100
  },
  descripcion: {
    type: String,
    default: ''
  },
  imagen: { type: String, default: null },
  tipo_oferta: {
    type: String,
    required: true,
    enum: ['descuento_porcentaje', 'descuento_fijo', 'envio_gratis']
  },
  valor: {
    type: Number,
    default: 0.00
  },
  fecha_inicio: {
    type: Date,
    required: true
  },
  fecha_fin: {
    type: Date,
    required: true
  },
  activa: {
    type: Boolean,
    default: true
  },
  codigo_promocional: {
    type: String,
    default: null,
    maxlength: 50
  },

aplica_a_categoria_id: {
  type: Types.ObjectId,
  ref: 'Categoria',
  default: null
},
aplica_a_producto_id: {
  type: Types.ObjectId,
  ref: 'Producto',
  default: null
},
  uso_maximo: {
    type: Number,
    default: null,
    min: 1
  },
  usos_realizados: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: { createdAt: 'creada_en', updatedAt: 'actualizada_en' }
});

module.exports = model('Oferta', ofertaSchema);
