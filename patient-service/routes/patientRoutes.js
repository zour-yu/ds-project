const express = require('express');
const router = express.Router();
const { getPatientProfile, createPatientProfile, updatePatientProfile } = require('../controllers/patientController');
const { verifyToken } = require('../middleware/authMiddleware');

// Define Routes
router.get('/profile', verifyToken, getPatientProfile);
router.post('/profile/create', verifyToken, createPatientProfile);
router.put('/profile', verifyToken, updatePatientProfile);

module.exports = router;