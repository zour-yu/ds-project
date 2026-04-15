const Patient = require('../models/Patient');

// @route   GET /api/patients/admin/all
// @desc    Get all patients' medical profiles (Admin only)
// @access  Private (Admin only)
const getAllPatientProfiles = async (req, res) => {
    try {
        // Find all patient medical profiles
        const patients = await Patient.find();
        res.status(200).json(patients);
    } catch (error) {
        console.error("Error fetching all patient profiles:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// @route   GET /api/patients/admin/:firebaseId
// @desc    Get a specific patient's medical profile by their firebaseId (Admin only)
// @access  Private (Admin only)
const getPatientProfileById = async (req, res) => {
    try {
        const patient = await Patient.findOne({ firebaseId: req.params.firebaseId });
        
        if (!patient) {
            return res.status(404).json({ message: 'Patient profile not found.' });
        }
        
        res.status(200).json(patient);
    } catch (error) {
        console.error("Error fetching patient profile by ID:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllPatientProfiles,
    getPatientProfileById
};
