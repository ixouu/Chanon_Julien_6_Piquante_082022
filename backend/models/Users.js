// import mongoose
const mongoose = require('mongoose');

// import validator as a plugin
const uniqueValidator = require('mongoose-unique-validator');

// import of mongoose error plugin 
const mongooseErrors = require('mongoose-errors')

// creation of the user schema
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator)
userSchema.plugin(mongooseErrors)

// give an acces to controllers/user.js
module.exports = mongoose.model('User', userSchema);