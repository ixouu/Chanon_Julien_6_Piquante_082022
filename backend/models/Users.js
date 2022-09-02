// import mongoose
const mongoose = require('mongoose');

// creation of the user schema
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    hiddenEmail: { type: String, required: true }
});


// give an acces to controllers/user.js
module.exports = mongoose.model('User', userSchema);