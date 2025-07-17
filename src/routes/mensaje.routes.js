// routes/mensaje.routes.js
const { Router } = require('express');
const router = Router();
const auth = require('../middlewares/auth');
const mensajeCtrl = require('../controller/mensaje.controller');

router.post('/', auth, mensajeCtrl.enviarMensaje);
router.get('/:usuarioId', auth, mensajeCtrl.obtenerConversacion);

module.exports = router;
