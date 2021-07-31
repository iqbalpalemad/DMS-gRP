const express   = require('express');
const router    = express.Router();

const signup    = require('../Controllers/auth/signup');
const login     = require('../Controllers/auth/login');
const validate  = require('../validation/auth');

router.post('/signup',validate.authValidate(),signup);
router.post('/login',validate.authValidate(),login);

module.exports = router;

