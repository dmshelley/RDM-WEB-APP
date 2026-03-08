const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/upload'); // 🚨 IMPORT MULTER HERE

router.get('/', userController.list);
router.get('/create', userController.renderCreate);

// 🚨 ADD upload.single('avatar') to intercept the file before the controller!
router.post('/create', upload.single('avatar'), userController.create);

router.get('/:id/edit', userController.renderEdit);

// 🚨 ADD upload.single('avatar') here too!
router.post('/:id/edit', upload.single('avatar'), userController.update);

router.post('/:id/deactivate', userController.deactivate);
router.post('/:id/reactivate', userController.reactivate);

module.exports = router;