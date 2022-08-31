// import of sauce model
const Sauce = require('../models/Sauces');

// import node package filesystem
const fs = require('fs');

const Sauces = require('../models/Sauces');


// middleware to get a sauce based on the ID
exports.getOneSauce = async (req, res, next) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id })
        if (!sauce){
            res.status(404).json({ message: 'sauce not found' })
        }
        res.status(200).send(sauce)
    } catch (error) {
        return error => res.status(500).json({ error })
    }
}

// middleware to get all sauces
exports.getAllSauces = async (req, res, next) => {
    try {
        const sauces = await Sauce.find()
        res.status(200).send(sauces)
        if (!sauces){
            res.status(404).json({ message: 'sauces not found' })
        }
    } catch (error) {
        return error => res.status(500).json({ error })
    }
}

// middleware  who return the sauce with the ID
exports.createSauce = async (req, res, next) => {
    try {
        const sauceObj = await JSON.parse(req.body.sauce);
        if (!sauceObj) {
            return res.status(400).json({ message: ' missing data ' })
        }
        const findSauce = await Sauce.findOne({ _id: req.params.id })
        if (findSauce !== null) {
            return res.statuts(403).json({ message: `The sauce ${req.body.name} is already existing` })
        }
        delete sauceObj._id;
        const sauce = new Sauce({
            ...sauceObj,
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        });
        sauce.save()
        return res.status(201).json({ message: 'created' })
    } catch (error) {
        return error => res.status(500).json({ error })
    }
}

// middleware that delete a sauce
exports.deleteSauce = async (req, res, next) => {
    try {
        const sauce = await Sauce.findById(req.params.id);
        // verifies the sauce author
        if (sauce.userId !== req.auth.userId){
            return res.status(403).json({ message : 'Unauthorized'})
        } else {        
            const filename = sauce.imageUrl.split('/images')[1];
            fs.unlink(`images/${filename}`, async () => {
            try {
                const sauceToDelete = await Sauce.deleteOne({ _id: req.params.id })
                return res.status(200).json({ sauceToDelete, message: 'deleted' });
            }
            catch (error) {
                res.status(403).json({ error })
            };
        })}
    } catch (error) {
        res.status(500).json({ error })
    }
}

// middleware that modify a sauce 
exports.modifySauce = async (req, res, next) => {
    try {
        const sauceObj = req.file ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {
            ...req.body
        }
        delete sauceObj._userdId;
        delete sauceObj._id;
        const sauce = await Sauce.findById(req.params.id);
        // verifies the sauce author
        if (sauce.userId !== req.auth.userId) {
            return res.status(403).json({ message: 'Unauthorized' })
        } else {
            sauceToUpdate = await Sauce.updateOne({ _id: req.params.id }, { ...sauceObj, _id: req.params.id })
            return res.status(200).json({ sauceToUpdate, message: 'updated' })
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}

// middleware who manage likes and dislikes into the db
exports.likes = async (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;
    try {
        const sauce = await Sauce.findById(req.params.id);
        // verifies if the user has authorisations to like or dislike
        if (sauce.userId !== req.auth.userId){
            return res.status(403).json({ message : 'Unauthorized'})
        }
        // verifies the like value
        if (Number.isInteger(like) == false || like > 1 || like < -1){
            return res.status(403).json({ message : 'Unauthorized'});
        }
        let sauceInfos = {
            usersDisliked: sauce.usersDisliked,
            usersLiked: sauce.usersLiked,
            likes: sauce.likes,
            dislikes: sauce.dislikes
        }
        switch (like) {
            case 1:
                if (sauceInfos.usersLiked.includes(userId) || sauceInfos.usersDisliked.includes(userId)) {
                    return res.status(403).json({ message: 'invalid action' })
                } else {
                    let sauceToUpdate = await sauce.updateOne({
                        $inc: { likes: +1 },
                        $push: { usersLiked: userId }
                    })
                    return res.status(200).json({ sauceToUpdate, message: 'like added' })
                }
                break;
            case -1:
                if (sauceInfos.usersLiked.includes(userId) || sauceInfos.usersDisliked.includes(userId)) {
                    return res.status(401).json({ error })
                } else {
                    let sauceToUpdate = await sauce.updateOne({
                        $inc: { dislikes: +1 },
                        $push: { usersDisliked: userId }
                    })
                    return res.status(200).json({ sauceToUpdate, message: 'dislike added' })
                }
                break;
            case 0:
                if (!sauceInfos.usersLiked.includes(userId) && !sauceInfos.usersDisliked.includes(userId)) {
                    return res.status(401).json({ error })
                } else if (sauceInfos.usersLiked.includes(userId)) {
                    let sauceToUpdate = await sauce.updateOne({
                        $inc: { likes: -1 },
                        $pull: { usersLiked: userId }
                    })
                    return res.status(200).json({ sauceToUpdate, message: 'like deleted' })
                } else if (sauceInfos.usersDisliked.includes(userId)) {
                    let sauceToUpdate = await sauce.updateOne({
                        $inc: { dislikes: -1 },
                        $pull: { usersDisliked: userId }
                    })
                    return res.status(200).json({ sauceToUpdate, message: 'dislike deleted' })
                }
                break;
            default:
                res.status(401).json({ error })
                break;
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}