const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../utils/authMiddleware');
const pacientesController = require('../controllers/pacientesController');

router.use(authMiddleware);

router.get('/', pacientesController.listPacientes);
router.post('/', pacientesController.createPaciente);
router.delete('/:id', pacientesController.deletePaciente);

module.exports = router;
