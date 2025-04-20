const express = require('express');
const router = express.Router();
const emailAuth = require('../controllers/login.controller');
const googleAuth = require('../controllers/googlelogin.controller');

router.post('/register', emailAuth.registerWithEmail);
router.post('/login', emailAuth.loginWithemail);
router.post('/google-login', googleAuth.loginWithGoogle);

module.exports = router;
