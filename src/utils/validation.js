const Joi = require('joi');

const signupSchema = Joi.object({
  name:Joi.string(),
  username:Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('admin', 'manager', 'employee').required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const validateSignup = (data) => {
  return signupSchema.validate(data);
};

const validateLogin = (data) => {
  return loginSchema.validate(data);
};

module.exports = { validateSignup, validateLogin };