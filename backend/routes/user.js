// import express
const express = require('express');

// import router
const router = express.Router();

// import user controller
const userCtrl = require('../controllers/user');

router.use('/signup', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    next()
});
router.post('/signup', userCtrl.signup);

router.use('/login', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    next()
    });
router.post('/login', userCtrl.login);

module.exports = router;