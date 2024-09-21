import multer from "multer";
import { v4 as uuid4 } from 'uuid'

const uploadImages = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, `${uuid4()}_${file.originalname}`);
    }
});


export const uploadImagesMiddleware = multer({storage: uploadImages}).array('images', 10);

