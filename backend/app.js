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
console.log('Environment running : '+ environment)

// import express
const express = require('express');

// import mongoose : 
const mongoose = require('mongoose');

// call of express :
const app = express();

// import of path
const path = require('path');

// import router user
const userRoutes = require('./routes/user')

// import router sauces
const saucesRoutes = require('./routes/sauces')



// connection to the DB
mongoose.connect(PiquanteUri,
//<protocol>://<USER>:<PWD>@<SERVER>[:<PORT>]/<ENDPOINT>[?<PARAMS>]
{ useNewUrlParser: true,
    useUnifiedTopology: true 
})
  .then(() => console.log('Connexion to MongoDB is successfull'))
  .catch(() => console.log('Connexion to MongoDB failed'));

//Intercept all request who have a json contentType to be able to use tu body.req
app.use(express.json());

//header configuration 
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Accept, Content, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// login and signup route
app.use('/api/auth', userRoutes)

// products route
app.use('/api/sauces', saucesRoutes)

// product route
// app.use('/api/sauces/:id', saucesRoutes)

// define the path where the image will be store
app.use('/images', express.static(path.join(__dirname, 'images')));

// Give an acces for server.js
module.exports = app;