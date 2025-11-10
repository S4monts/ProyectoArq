const express = require('express');
const router = express.Router();
const citasController = require('../controllers/citasController');

router.get('/', citasController.listar);
router.post('/', citasController.crear);

module.exports = router;