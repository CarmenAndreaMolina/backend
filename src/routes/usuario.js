const { Router } = require('express');
const router = Router();

const usuarioCtrl = require('../controller/usuario.controller');

router.post('/login', usuarioCtrl.loginUsuario);

router.route('/')
  .get(usuarioCtrl.getUsu)
  .post(usuarioCtrl.createUsu);

router.route('/:id')
  .get(usuarioCtrl.getUsuario)
  .delete(usuarioCtrl.deleteUsu)
  .put(usuarioCtrl.updateUsu);

module.exports = router;

