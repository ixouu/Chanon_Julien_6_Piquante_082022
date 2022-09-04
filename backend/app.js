'use strict';

// load env variables
const dotenv = require("dotenv").config();

// import env variables
const environment = process.env.NODE_ENV;
const mongodbPassword = process.env.MONGODBPWD;
const mongodbServer = process.env.MONGODBSERVER;
const mongodbId = process.env.MONGODBID;
const protocol = process.env.PROTOCOL;
const endpoint = process.env.ENDPOINT;

// DB Piquante URI
const PiquanteUri = `${protocol}://${mongodbId}:${mongodbPassword}@${mongodbServer}/${endpoint}`;

// Verify witch environment we are using
console.log('Environment running : ' + environment)

// import express
const express = require('express');

// import mongoose : 
const mongoose = require('mongoose');

// call of express :
const app = express();

// import of path
const path = require('path');

// import router user
const userRoutes = require('./routes/user');

// import router sauces
const saucesRoutes = require('./routes/sauces');

// import rateLimit 
const rateLimit = require('express-rate-limit');

// import helmet
const helmet = require("helmet");

// limit api calls
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// import cors package
const cors = require('cors');

// connection to the DB
mongoose.connect(PiquanteUri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion to MongoDB is successfull'))
  .catch(() => console.log('Connexion to MongoDB failed'));

// DB error handler
mongoose.connection.on("error", (err) => {
  console.error('error : ' + err)
})

// set the headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  next();
});

//Intercept all request who have a json contentType to be able to use tu body.req
app.use(express.json());
app.use(cors());

//use helmet to securse http headers
app.use(helmet.hidePoweredBy());
app.use(helmet.crossOriginResourcePolicy({ policy: "same-site" }));

// login and signup route
app.use('/api/auth', apiLimiter, userRoutes)

// Sauce route
app.use('/api/sauces', apiLimiter, saucesRoutes)

// define the path where the image will be store
app.use('/images', express.static(path.join(__dirname, 'images')));

// Give an acces for server.js
module.exports = app;