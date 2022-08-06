// import of mongoose
const mongoose = require('mongoose');

// creation of the sauce schema

const sauceSchema = mongoose.Schema({

    userId : { type: String, required: true },
    name : { type: String },
    manufacturer : { type: String },
    description : { type: String },
    mainPepper : { type: String },
    imageURL: { type: String },
    heat : { type : Number },
    likes : { type : Number },
    dislikes : { type : Number },
    usersLiked : [{ type : string }],
    usersDisliked : [{ type : string }]

})

// give an acces to controllers/sauce.js
module.exports = mongoose.model('Sauce', sauceSchema);