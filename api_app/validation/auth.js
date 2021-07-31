const { body } = require('express-validator');

exports.authValidate = () => {
    return [
        body('email', 'Invalid email').exists().isEmail(),
        body('password').exists().isLength({ min: 5 })
    ]
}