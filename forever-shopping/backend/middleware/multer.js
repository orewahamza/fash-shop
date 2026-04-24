import multer from 'multer';

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/avif'];

const fileFilter = (req, file, cb) => {
    if (IMAGE_MIMES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 4
    }
});

export default upload;
