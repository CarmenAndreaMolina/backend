const express = require('express');
const router = express.Router();
const carritoCtrl = require('../controller/carrito.controller');
const verificarToken = require('../middlewares/auth'); // si ya tienes un middleware para login

router.get('/', verificarToken, carritoCtrl.obtenerCarrito);
router.post('/agregar', verificarToken, carritoCtrl.agregarAlCarrito);
router.delete('/eliminar/:productoId', verificarToken, carritoCtrl.eliminarDelCarrito);
router.delete('/vaciar', verificarToken, carritoCtrl.vaciarCarrito);

module.exports = router;
