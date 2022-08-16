// import of sauce model
const Sauce = require('../models/Sauces');

// import node package filesystem
const fs = require('fs');

// middleware to get a sauce based on the ID
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).send(sauce))
        .catch(error => res.status(401).json({ error: error }));
}

// middleware to get the array of sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).send(sauces))
        .catch(error => res.status(401).json({ error: error }));
}

// middleware  who return the sauce with the ID
exports.CreateSauce = (req, res, next) => {
    const sauceObj = JSON.parse(req.body.sauce)
    const sauce = new Sauce({
        ...sauceObj,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet créé' }))
        .catch((error) => res.status(400).json({ error: error }))
}

// middleware that delete a sauce
exports.DeleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401)
            } else {
                const filename = sauce.imageUrl.split('/images')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
                        .catch(error => res.status(401).json({ error: error }))
                })
            }
        })
        .catch(error => { res.status(500).json({ error: error }) })
}

// middleware that modify a sauce 
exports.ModifySauce = (req, res, next) => {
    const sauceObj = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    }
    delete sauceObj._userdId;
    // delete l id egalement
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(403)
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObj, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
                    .catch(error => res.status(401).json({ error: error }))
            }
        })
        .catch(error => {
            error.status(400).json({ error: error })
        })
}


// middleware who manage likes and dislikes into the db
exports.Likes = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            let sauceInfos = {
                usersDisliked: sauce.usersDisliked,
                usersLiked: sauce.usersLiked,
                likes: sauce.likes,
                dislikes: sauce.dislikes
            }
            if (like == -1) {
                if (!sauceInfos.usersLiked.includes(userId) && !sauceInfos.usersDisliked.includes(userId)) {
                    sauce.updateOne({
                        $inc: { dislikes: +1 },
                        $push: { usersDisliked: userId }
                    })
                        .then(() => res.status(200).json({ message: 'dislike ajouté' }))
                        .catch((error) => res.status(400).json({ error: error }));
                }
                else {
                    console.log(new Error('un utilisateur ne peut pas disliker plus d\'une fois'))
                }
            } else if (like == 1) {
                if (!sauceInfos.usersLiked.includes(userId) && !sauceInfos.usersDisliked.includes(userId)) {
                    sauce.updateOne({
                        $inc: { likes: +1 },
                        $push: { usersLiked: userId }
                    })
                        .then(() => res.status(200).json({ message: 'like ajouté' }))
                        .catch((error) => res.status(400).json({ error: error }));
                } else {
                    console.log(new Error('un utilisateur ne peut pas liker plus d\'une fois'))
                }
            } else if (like == 0) {
                if (sauceInfos.usersLiked.includes(userId)) {
                    sauce.updateOne({
                        $inc: { likes: -1 },
                        $pull: { usersLiked: userId }
                    })
                        .then(() => res.status(200).json({ message: 'like supprimé' }))
                        .catch((error) => res.status(400).json({ error: error }));
                } else if (sauceInfos.usersDisliked.includes(userId)) {
                    sauce.updateOne({
                        $inc: { dislikes: -1 },
                        $pull: { usersDisliked: userId }
                    })
                        .then(() => res.status(200).json({ message: 'dislike supprimé' }))
                        .catch((error) => res.status(400).json({ error: error }));
                }
            }
        })
}
/*else if(sauceInfos.usersLiked.includes(userId) ){
    sauce.updateOne({
        $pull: {usersLiked : userId}
    })
    .then(() => res.status(200).json({ message: 'dislike ajouté' }))
} */