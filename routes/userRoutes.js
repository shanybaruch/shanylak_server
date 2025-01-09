const express = require('express');
const userController = require('../controllers/userController'); // Path to your controller file

const router = express.Router();

// Routes
router.get('/', userController.getAllUsers); // Get all users
router.post('/register', userController.register); // Register user
router.post('/verify', userController.verifyCode); // Verify authentication code
router.post('/login', userController.login); // Login user

module.exports = router;
