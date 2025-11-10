// Middleware de validación usando express-validator
const { validationResult } = require('express-validator');

/**
 * validateResults: middleware final que revisa results de express-validator
 */
function validateResults(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  // Formatear errores
  const formatted = errors.array().map(err => ({
    field: err.param,
    msg: err.msg,
    value: err.value
  }));

  return res.status(400).json({
    ok: false,
    msg: 'Error de validación',
    errors: formatted
  });
}

module.exports = validateResults;