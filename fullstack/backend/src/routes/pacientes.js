const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../utils/authMiddleware');
const pacientesController = require('../controllers/pacientesController');

router.use(authMiddleware);

router.get('/', pacientesController.listPacientes);
router.post('/', requireRole('admin'), pacientesController.createPaciente);
router.delete('/:id', requireRole('admin'), pacientesController.deletePaciente);

module.exports = router;
