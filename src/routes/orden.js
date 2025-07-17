const { Router } = require('express');
const router = Router();

const {
  crearOrden,
  obtenerOrdenes,
  obtenerOrdenPorId,
  actualizarOrden,
  eliminarOrden,
  aprobarOrden, 
  rechazarOrden,
} = require('../controller/orden.controller');

// Obtener todas las órdenes
router.get('/', obtenerOrdenes);

// Crear una nueva orden
router.post('/', crearOrden);


router.post('/aprobar/:id', aprobarOrden);

// Obtener una orden específica por ID
router.get('/:id', obtenerOrdenPorId);

// Actualizar una orden
router.put('/:id', actualizarOrden);

// Eliminar una orden
router.delete('/:id', eliminarOrden);

router.post('/rechazar/:id', rechazarOrden);


module.exports = router;
