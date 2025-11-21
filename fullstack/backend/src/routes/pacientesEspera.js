const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../utils/authMiddleware');
const controller = require('../controllers/pacientesEsperaController');

router.use(authMiddleware);

router.get('/', controller.listEspera);
router.post('/', controller.createEspera);
router.delete('/:id', controller.removeEspera);
router.post('/:id/accept', controller.acceptEspera);

module.exports = router;
