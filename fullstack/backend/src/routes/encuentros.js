const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../utils/authMiddleware');
const encuentrosController = require('../controllers/encuentrosController');

router.use(authMiddleware);

router.post('/', encuentrosController.createEncuentro);
router.get('/', encuentrosController.listEncuentros);

module.exports = router;
