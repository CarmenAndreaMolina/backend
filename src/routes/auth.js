const { Router } = require('express');
const router = Router();

const { registro, login, loginConGoogle } = require('../controller/auth.controller');

router.post('/google', loginConGoogle); 
router.post('/registro', registro);
router.post('/login', login);

module.exports = router;

