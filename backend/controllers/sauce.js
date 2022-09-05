'use strict';

// import of sauce model
const Sauce = require('../models/Sauces');

// import node package filesystem
const fs = require('fs');



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
        if (!sauces){
            res.status(404).json({ message: 'sauces not found' })
        }
        res.status(200).send(sauces)
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
exports.modifySauce = (req, res, next) => {
    const sauceContent = req.file
      ? {
          // parse to be able to update image
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };
    delete sauceContent._userId;
    Sauce.findById(req.params.id).then(sauce => {
      if (sauce.userId !== req.auth.userId) {
        res.status(401).json({ message: 'Unauthorized' });
      } else {
        Sauce.findByIdAndUpdate(req.params.id, {
          ...sauceContent,
          _id: req.params.id,
        })
          .then(() => res.status(200).json({ message: 'Sauce update !' }))
          .catch(error => res.status(401).json({ error }));
      }
    });
};
  
// middleware who manage likes and dislikes into the db
exports.likes = (req, res) => {
    Sauce.findById(req.params.id)
      .then(sauce => {
        switch (req.body.like) {
          case 0:
            // verifies if the user has authorisations to like or dislike
            if (sauce.usersLiked.includes(req.auth.userId)) {
              // return index of userId in liked array
              const indexOfUser = sauce.usersLiked.indexOf(req.auth.userId);
              Sauce.findByIdAndUpdate(req.params.id, {
                ...sauce,
                likes: sauce.likes--,
                // remove current userId from liked array
                usersLiked: sauce.usersLiked.splice(indexOfUser, 1),
              })
                .then(() => res.status(200).json({ message: 'Sauce unliked' }))
                .catch(error => res.status(401).json({ error }));
            }
            if (sauce.usersDisliked.includes(req.auth.userId)) {
              const indexOfUser = sauce.usersDisliked.indexOf(req.auth.userId);
              Sauce.findByIdAndUpdate(req.params.id, {
                ...sauce,
                dislikes: sauce.dislikes--,
                usersDisliked: sauce.usersDisliked.splice(indexOfUser, 1),
              })
                .then(() => res.status(200).json({ message: 'Sauce undisliked' }))
                .catch(error => res.status(401).json({ error }));
            }
            break;
          case 1:
            Sauce.findByIdAndUpdate(req.params.id, {
              ...sauce,
              likes: sauce.likes++,
              usersLiked: sauce.usersLiked.push(req.auth.userId),
            })
              .then(() => res.status(200).json({ message: 'Sauce liked !' }))
              .catch(error => res.status(401).json({ error }));
            break;
          case -1:
            Sauce.findByIdAndUpdate(req.params.id, {
              ...sauce,
              dislikes: sauce.dislikes++,
              usersDisliked: sauce.usersDisliked.push(req.auth.userId),
            })
              .then(() => res.status(200).json({ message: 'Sauce disliked...' }))
              .catch(error => res.status(401).json({ error }));
            break;
        }
      })
      .catch(error => res.status(401).json({ error }));
  };