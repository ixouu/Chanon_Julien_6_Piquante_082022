// import express
const express = require('express');

// import router
const router = express.Router();

// import user controller
const userCtrl = require('../controllers/user');


router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login); 

module.exports = router;