const { Router } = require('express');
const router = Router();

const {
  createOferta,
  getOfertas,
  getOferta,
  updateOferta,
  deleteOferta
} = require('../controller/oferta.controller');

// Rutas principales
router.route('/')
  .get(getOfertas)
  .post(createOferta);

// Rutas por ID
router.route('/:id')
  .get(getOferta)
  .put(updateOferta)
  .delete(deleteOferta);

module.exports = router;
