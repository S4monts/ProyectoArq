const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../utils/authMiddleware');
const doctoresController = require('../controllers/doctoresController');

router.use(authMiddleware);

router.get('/', doctoresController.listDoctores);
router.post('/', doctoresController.createDoctor);

module.exports = router;
