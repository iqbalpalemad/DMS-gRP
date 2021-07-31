const express   = require('express');
const router    = express.Router();

const signup    = require('../Controllers/auth/signup');
const validate  = require('../validation/auth');

router.post('/signup',validate.authValidate(),signup);

module.exports = router;

