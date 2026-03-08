const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const upload = require('../middleware/upload'); // 🚨 NEW

router.get('/', profileController.renderProfile);

// 🚨 NEW: Added upload.single('avatar')
router.post('/', upload.single('avatar'), profileController.updateProfile);

module.exports = router;