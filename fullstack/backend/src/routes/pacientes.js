const express = require('express');
const { body, param } = require('express-validator');
const validateResults = require('../middlewares/validate');
const ctrl = require('../controllers/pacientesController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Crear paciente: nombre requerido, email opcional válido, telefono opcional
router.post(
  '/',
  auth,
  [
    body('nombre').trim().notEmpty().withMessage('Nombre es requerido'),
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('telefono').optional().isLength({ min: 6 }).withMessage('Teléfono muy corto')
  ],
  validateResults,
  ctrl.crear
);

// Listar
router.get('/', auth, ctrl.listar);

// Obtener por id (param debe ser número)
router.get(
  '/:id',
  auth,
  [ param('id').isInt().withMessage('id debe ser un número entero') ],
  validateResults,
  ctrl.obtener
);

// Actualizar
router.put(
  '/:id',
  auth,
  [
    param('id').isInt().withMessage('id debe ser un número entero'),
    body('nombre').optional().notEmpty().withMessage('Nombre no puede estar vacío'),
    body('email').optional().isEmail().withMessage('Email inválido')
  ],
  validateResults,
  ctrl.actualizar
);

// Eliminar
router.delete(
  '/:id',
  auth,
  [ param('id').isInt().withMessage('id debe ser un número entero') ],
  validateResults,
  ctrl.eliminar
);

module.exports = router;