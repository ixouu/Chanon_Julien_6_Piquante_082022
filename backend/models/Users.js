// import mongoose
const mongoose = require('mongoose');

// import validator as a plugin
const uniqueValidator = require('mongoose-unique-validator');

// creation of the user schema
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator)

// give an acces to controllers/user.js
module.exports = mongoose.model('User', userSchema);