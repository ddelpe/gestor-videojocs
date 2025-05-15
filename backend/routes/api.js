const express = require('express');
const router = express.Router();
const videojocController = require('../controllers/videojocController');

router.get('/videojocs', videojocController.getAll);
router.get('/videojocs/:id', videojocController.getById);
router.post('/videojocs', videojocController.create);
router.put('/videojocs/:id', videojocController.update);
router.delete('/videojocs/:id', videojocController.delete);

module.exports = router;