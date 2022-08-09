// import of mongoose
const mongoose = require('mongoose');


// creation of the sauce schema

const modelsSauce = new mongoose.Schema({

    userId : { type: String, required: true },
    name : { type: String, required: true },
    manufacturer : { type: String, required: true },
    description : { type: String, required: true },
    mainPepper : { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat : { type: Number, required: true },
    likes : { type: Number, default : 0 },
    dislikes : { type: Number, default: 0 },
    usersLiked :  [{userId : String}] ,
    usersDisliked : [{userId : String}] 

})

// give an acces to controllers/sauce.js
module.exports = mongoose.model('Sauce', modelsSauce);