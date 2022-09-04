'use strict';

// import express
const express = require('express');

// import router
const router = express.Router();

// import the middleware auth 
const auth = require('../middleware/auth');

// import the middleware multer for images
const multer = require('../middleware/multer');

// import sauce controller
const sauceCtrl = require('../controllers/sauce');

// create sauce
router.post('/', auth, multer, sauceCtrl.createSauce);

// get one sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);

// get all sauces 
router.get('/', auth, sauceCtrl.getAllSauces);

// delete a sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// modify a sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

// sauce likes
router.post('/:id/like', auth, sauceCtrl.likes);


module.exports = router;