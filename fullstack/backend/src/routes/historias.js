const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../utils/authMiddleware');
const historiasController = require('../controllers/historiasController');

router.use(authMiddleware);

router.get('/', historiasController.listHistorias);
router.post('/:pacienteId/evoluciones', historiasController.addEvolucion);

module.exports = router;
