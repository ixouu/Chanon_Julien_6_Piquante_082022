// import express
const express = require('express');

// import router
const router = express.Router();

//import the middleware auth 
const auth = require('../middleware/auth');

//import the middleware multer for images
const multer = require('../middleware/multer');

//import sauce controller
const sauceCtrl = require('../controllers/sauce')

