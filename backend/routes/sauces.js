// import express
const express = require('express');

// import router
const router = express.Router();

//import the middleware auth 
const auth = require('../middleware/auth');

//import the middleware multer for images
const multer = require('../middleware/multer');

//import sauce controller
const sauceCtrl = require('../controllers/sauce');


router.use('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    next()
});
router.post('/', auth, multer, sauceCtrl.createSauce);

router.use('/:id', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    next()
});
router.get('/:id', auth, sauceCtrl.getOneSauce);

router.use('/:id', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'DELETE,OPTIONS');
    next()
});
router.delete('/:id', auth, sauceCtrl.deleteSauce);

router.use('/:id', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'PUT,OPTIONS');
    next()
});
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

router.use('/:id/like', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    next()
});
router.post('/:id/like', auth, sauceCtrl.likes);

router.use('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    next()
});
router.get('/', auth, sauceCtrl.getAllSauces);


module.exports = router;