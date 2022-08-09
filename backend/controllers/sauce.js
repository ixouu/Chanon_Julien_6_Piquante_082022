// import of sauce model
const Sauce = require('../models/Sauces');


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