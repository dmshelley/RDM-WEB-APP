const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the avatars directory exists before we try to save to it
const dir = './public/uploads/avatars';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

// Configure where and how the files are saved
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/avatars')
    },
    filename: function (req, file, cb) {
        // Renames "my_picture.jpg" to "avatar-123456789.jpg" so names never clash
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname))
    }
});

// Create the upload middleware
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    }
});

module.exports = upload;