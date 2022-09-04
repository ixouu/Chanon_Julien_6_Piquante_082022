'use strict';

// load env variables
const dotenv = require("dotenv").config();

// import the secrets keys 
const secretKey = process.env.SECRETKEY;
const hmacKey = process.env.HMACKEY;

// import bcrypt
const bcrypt = require('bcrypt');

// import user model
const User = require('../models/Users');

// import json web token
const jsonwebtoken = require('jsonwebtoken');

// import crypto JS
const cryptoJS = require('crypto-js');

// import validator
const validator = require('validator');

// function that hides emails
function hideEmails(email) {

    const startOfEmail = email.slice(0, 2)
    const displayEmailChar = email.replace(/[a-zA-Z.0-9]/g, '*')
    const result = displayEmailChar.replace('**', startOfEmail)
    return result
}

// middleware signup , user doesn't exist yet
exports.signup = async (req, res, next) => {
    try {
        if (!validator.isEmail(req.body.email)) {
            return res.status(403).json({ message: 'email format is not correct' })
        }
        if (!validator.isStrongPassword(req.body.password)) {
            return res.status(403).json({ message: 'password not strong enough' });
        } else {
            let encryptingEmail = cryptoJS.HmacSHA512(req.body.email, hmacKey);
            let hashEmail = encryptingEmail.toString(cryptoJS.enc.Base64);
            let hideEmail = hideEmails(req.body.email);
            let emailisExisting = await User.find({ email: `${hashEmail}` })
            if (emailisExisting.length !== 0) {
                return res.status(403).json({ message: 'user already exists' });
            } else {
                bcrypt.hash(req.body.password, 10)
                    .then(function (hash) {
                        const user = new User({
                            email: hashEmail,
                            password: hash,
                            hiddenEmail: hideEmail
                        });
                        user.save()
                            .then(() => res.status(201).json({ message: 'user created' }))
                    })
            }
        }

    } catch (error) {
        return error => res.status(500).json({ error })
    }
};

// middleware login, user already has an account
exports.login = async (req, res, next) => {
    try {
        let encryptingEmail = cryptoJS.HmacSHA512(req.body.email, hmacKey);
        let hashEmail = encryptingEmail.toString(cryptoJS.enc.Base64);
        const user = await User.findOne({ email: hashEmail })
        if (!user) {
            return res.status(404).json({ message: 'user not found' })
        }
        const compare = await bcrypt.compare(req.body.password, user.password)
        if (!compare) {
            return res.status(422).json({ message: 'password mismatch' })
        } else {
            await res.status(201).json({
                userId: user._id,
                token: jsonwebtoken.sign(
                    { userId: user._id },
                    secretKey,
                    { expiresIn: '24h' }
                )
            })
        }
    } catch (error) {
        return error => res.status(500).json({ error })
    }
};