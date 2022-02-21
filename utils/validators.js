const joi = require('joi');
const { respondFailure } = require('../utils/responders');

module.exports.registerationValidation = async (req, res, next) => {
    const schema = joi.object({
        name: joi.string().min(3).max(32).required().alphanum(),
        username: joi.string().min(3).max(32).required().alphanum(),
        email: joi.string().min(3).max(64).required().email(),
        password: joi.string().min(6).max(32).required().regex(/^[^<>%$()]*$/),
        role: joi.string().valid('user', 'coordinator').required()
    }).required();
    const result = schema.validate(req.body);
    if(result.error) return respondFailure(res, result.error.details[0].message, 400);
    next();
}

module.exports.loginValidation = async (req, res, next) => {
    const schema = joi.object({
        username: joi.string().min(3).max(32).required().alphanum(),
        password: joi.string().min(6).max(32).required().regex(/^[^<>%$()]*$/).message('Password must not contain $()<>%')
    }).required();
    const result = schema.validate(req.body);
    if(result.error) return respondFailure(res, result.error.details[0].message, 400);
    next();
}