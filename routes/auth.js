const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ensure these method names match the controller exactly
router.get('/login', authController.renderLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;