const express = require('express');
const router = express.Router();
const videojocController = require('../controllers/videojocController');
const usuarioController = require('../controllers/usuarioController');
const auth = require('../middleware/auth');

router.post('/usuarios/registrar', usuarioController.registrar);
router.post('/usuarios/login', usuarioController.login);

router.get('/videojocs', auth.verificarToken, videojocController.getAll);
router.post('/videojocs', auth.verificarToken, auth.esAdmin, videojocController.create);
router.put('/videojocs/:id', auth.verificarToken, auth.esAdmin, videojocController.update);
router.delete('/videojocs/:id', auth.verificarToken, auth.esAdmin, videojocController.delete);

module.exports = router;