// load env variables
const dotenv = require("dotenv").config();

// import jsonwebtoken
const jsonwebtoken = require('jsonwebtoken');

// import the secret key 
const secretKey = process.env.SECRETKEY;

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jsonwebtoken.verify(token, secretKey);
        const userId = decodedToken.userId;
        req.auth = {
            userId : userId
        }
        next();
    } catch(error){
        res.status(401).json({ error : error });
    }
};