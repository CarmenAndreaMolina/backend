const { Router } = require('express');
const router = Router();

const {
  crearVenta,
  obtenerVentas,
  obtenerVentaPorId,
  actualizarVenta,
  eliminarVenta
} = require('../controller/venta.controller');

// Obtener todas las ventas
router.get('/', obtenerVentas);

// Crear una nueva venta
router.post('/', crearVenta);

// Obtener una venta específica por ID
router.get('/:id', obtenerVentaPorId);

// Actualizar una venta
router.put('/:id', actualizarVenta);

// Eliminar una venta
router.delete('/:id', eliminarVenta);

module.exports = router;
