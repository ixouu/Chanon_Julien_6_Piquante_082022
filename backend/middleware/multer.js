// import of multer package
const multer = require('multer');

//import of path 
const path = require('path');

// Creation of a lib that aims to manage image's extensions 
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Setup of multer , define the folder destination , rename the file with a timestamp
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const NameWithoutExtension = path.parse(file.originalname).name;
        const name = NameWithoutExtension.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension)
    }
});

// Define a unique object
module.exports = multer({ storage }).single('image');