// import of multer package
const multer = require('multer');

// Creation of a lib that aims to manage image's extensions 
const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
};

// Setup of multer , define the folder destination , rename the file with a timestamp
const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        callback(null, 'images')
    },
    filename : (req, file, callback) =>{
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension)
    }
});

// Define a unique object
module.exports = multer({ storage }).single('image');