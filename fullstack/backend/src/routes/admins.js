const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../utils/authMiddleware');
const adminsController = require('../controllers/adminsController');

router.use(authMiddleware);

router.get('/', adminsController.listAdmins);
router.post('/', adminsController.createAdmin);
router.put('/:id', adminsController.updateAdmin);
router.delete('/:id', adminsController.deleteAdmin);

module.exports = router;
