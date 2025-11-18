const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../utils/authMiddleware');
const ingresosController = require('../controllers/ingresosController');

router.use(authMiddleware);

router.post('/', ingresosController.createIngreso);
router.get('/', ingresosController.listIngresos);

module.exports = router;
