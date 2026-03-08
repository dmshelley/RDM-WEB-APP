const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../public/images/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, 'shop-logo-' + Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

// Security check
router.use((req, res, next) => {
    if (req.session.userRole !== 'Manager') return res.redirect('/'); 
    next();
});

router.get('/', settingsController.renderSettings);
router.post('/', upload.single('logoFile'), settingsController.update);

// 🚨 NEW: Route to handle theme resets
router.post('/reset-branding', settingsController.resetBranding);

router.post('/services', settingsController.addService);
router.post('/services/:id/delete', settingsController.deleteService);

module.exports = router;