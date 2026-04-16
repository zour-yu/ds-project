const User = require('../models/User');
const admin = require('../config/firebase');

// @route   GET /api/auth/admin/doctors/pending
// @desc    Get all pending doctors
// @access  Private (Admin only)
const getPendingDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor', status: 'pending' });
        res.status(200).json(doctors);
    } catch (error) {
        console.error("Error fetching pending doctors:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// @route   PATCH /api/auth/admin/doctors/:firebaseId/verify
// @desc    Verify a doctor
// @access  Private (Admin only)
const verifyDoctor = async (req, res) => {
    try {
        const { firebaseId } = req.params;

        const user = await User.findOneAndUpdate(
            { firebaseId, role: 'doctor' },
            { status: 'approved' },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'Doctor not found.' });
        }

        // Technically already set during registration, but we can re-affirm the approved claim if we want
        await admin.auth().setCustomUserClaims(firebaseId, { role: 'doctor', status: 'approved' });

        res.status(200).json({ message: 'Doctor verified successfully', user });
    } catch (error) {
        console.error("Error verifying doctor:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// @route   PATCH /api/auth/admin/doctors/:firebaseId/reject
// @desc    Reject a doctor
// @access  Private (Admin only)
const rejectDoctor = async (req, res) => {
    try {
        const { firebaseId } = req.params;

        const user = await User.findOneAndUpdate(
            { firebaseId, role: 'doctor' },
            { status: 'rejected' },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'Doctor not found.' });
        }

        // Update firebase claim to block
        await admin.auth().setCustomUserClaims(firebaseId, { role: 'doctor', status: 'rejected' });

        res.status(200).json({ message: 'Doctor rejected', user });
    } catch (error) {
        console.error("Error rejecting doctor:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getPendingDoctors,
    verifyDoctor,
    rejectDoctor
};