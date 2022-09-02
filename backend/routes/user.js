// import express
const express = require('express');

// import router
const router = express.Router();

// import user controller
const userCtrl = require('../controllers/user');

//signup route
router.use('/signup', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    next()
});
router.post('/signup', userCtrl.signup);

//login route
router.use('/login', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    next()
    });
router.post('/login', userCtrl.login);

module.exports = router;