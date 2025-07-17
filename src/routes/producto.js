const { Router } = require('express');
const router = Router();

const {
  createProdu,
  getProdu,
  getProducto,
  deleteProdu,
  updateProdu,
  actualizarStock
} = require('../controller/producto.controller');

// Rutas principales sin multer
router.route('/')
  .get(getProdu)
  .post(createProdu);  // <-- sin multer

// Rutas con ID sin multer
router.route('/:id')
  .get(getProducto)
  .delete(deleteProdu)
  .put(updateProdu);  // <-- sin multer

// Ruta para actualizar solo el stock
router.route('/actualizar-stock/:id')
  .patch(actualizarStock);

module.exports = router;
