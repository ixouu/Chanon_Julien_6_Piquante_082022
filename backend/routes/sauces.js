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

router.get('/', auth, sauceCtrl.getAllSauces);

router.get('/:id', auth, sauceCtrl.getOneSauce);

router.post('/', auth, multer, sauceCtrl.CreateSauce);

router.delete('/:id', auth, sauceCtrl.DeleteSauce);

router.put('/:id', auth, multer, sauceCtrl.ModifySauce);

router.post('/:id/like', auth, sauceCtrl.Likes)

module.exports = router;
