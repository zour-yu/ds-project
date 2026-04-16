const express = require('express');
const router = express.Router();
const { registerUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { getPendingDoctors, verifyDoctor, rejectDoctor } = require('../controllers/adminController');
const { verifyToken, verifyAdminToken } = require('../middleware/authMiddleware');

// POST /api/auth/register
// User already registered via frontend, so we just save them in MongoDB + add claims
router.post('/register', verifyToken, registerUser);

// GET /api/auth/me
router.get('/me', verifyToken, getUserProfile);

// PUT /api/auth/profile
router.put('/profile', verifyToken, updateUserProfile);

// Admin Routes
router.get('/admin/doctors/pending', verifyAdminToken, getPendingDoctors);
router.patch('/admin/doctors/:firebaseId/verify', verifyAdminToken, verifyDoctor);
router.patch('/admin/doctors/:firebaseId/reject', verifyAdminToken, rejectDoctor);

module.exports = router;
