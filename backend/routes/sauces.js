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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    next()});
router.post('/', auth, multer, sauceCtrl.createSauce);

router.use('/:id', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    next()
});
router.get('/:id', auth, sauceCtrl.getOneSauce);

router.use('/:id', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    next()
});
router.delete('/:id', auth, sauceCtrl.deleteSauce);

router.use('/:id', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'PUT,OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    next()
});
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

router.use('/:id/like', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    next()
});
router.post('/:id/like', auth, sauceCtrl.likes)

router.use('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); 
    next()
});
router.get('/', auth, sauceCtrl.getAllSauces);


module.exports = router;