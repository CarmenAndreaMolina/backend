const express = require('express');
const router = express.Router();
const { crearFactura } = require('../controller/factura.controller');

router.post('/', crearFactura);

module.exports = router;
