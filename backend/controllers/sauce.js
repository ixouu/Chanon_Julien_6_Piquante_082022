// import of sauce model
const Sauce = require('../models/Sauces');

// import node package filesystem
const fs = require('fs');
const { deepStrictEqual } = require('assert');

// middleware to get a sauce based on the ID
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).send(sauce))
    .catch(error => res.status(400).json({ error : error }));
}

// middleware to get the array of sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).send(sauces))
    .catch(error => res.status(400).json({ error : error }));
}

// middleware  who return the sauce with the ID
exports.CreateSauce = (req, res, next) => {
    const sauceObj = JSON.parse(req.body.sauce)
    const sauce = new Sauce({
        ...sauceObj,
        userId: req.auth.userId,
        imageUrl : `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    });
    sauce.save()
    .then(() => res.status(201).json({ message : 'Objet créé' }))
    .catch((error) => res.status(400).json({ error : error}))
}

// middleware that delete a sauce
exports.DeleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then( sauce => {
        if (sauce.userId != req.auth.userId){
            res.status(401).json({ message : 'Opération non autorisée' })
        } else {
            const filename = sauce.imageUrl.split('/images')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                .then( () => { res.status(200).json({ message : 'Sauce supprimée' })})
                .catch(error => res.status(401).json({ error : error }))
            })
        }
    })
    .catch( error => {res.status(500).json({ error : error })})
}