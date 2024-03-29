const {validationResult} = require('express-validator')
    
// Finds the validation errors in this request and wraps them in an object with handy functions
exports.validatorMiddleWare = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  };
  next();
};