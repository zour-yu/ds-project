const express = require('express');
const router = express.Router();
const { registerUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/auth/register
// User already registered via frontend, so we just save them in MongoDB + add claims
router.post('/register', verifyToken, registerUser);

// GET /api/auth/me
router.get('/me', verifyToken, getUserProfile);

// PUT /api/auth/profile
router.put('/profile', verifyToken, updateUserProfile);

module.exports = router;
