import multer from "multer";
import {v4 as uuid4} from "uuid";

const uploadImage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, `${uuid4()}_${file.originalname}`);
    }
});


export const uploadOneImageMiddleware = multer({ storage: uploadImage }).single('avatar');

