const multer = require('multer');
const uuid = require('uuid').v4;
const MIME_TYPE_MAP = {
    "image/jpeg" : "jpeg",
    "image/jpg"  : "jpg",
    "image/png"  : "png"
}

const FileUpload = multer({

    limits : 50000,

    storage: multer.diskStorage({
        destination : (req, file, cb) => {
            cb(null , 'uploads/images')

        },

        filename: (req, file, cb) => {

            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null , uuid() + '.' + ext);

        },


    }),

    fileFilter: (req, file, cb) => {
        console.log(file)
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        console.log("iv", isValid);
        if(!isValid){
            cb(new Error("Please input an image") , false);
        }
        else{
            cb(null ,true);
        }


    }




})

module.exports = FileUpload