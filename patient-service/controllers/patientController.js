const Patient = require('../models/Patient');

// @route   GET /api/patients/profile
// @desc    Get the currently logged-in patient's medical profile
// @access  Private (Patient only)
const getPatientProfile = async (req, res) => {
    try {
        const patient = await Patient.findOne({ firebaseId: req.user.firebaseId });
        
        if (!patient) {
            return res.status(404).json({ message: 'Medical profile not found for this user.' });
        }
        
        res.status(200).json(patient);
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// @route   POST /api/patients/profile/create
// @desc    Create a new patient medical profile
// @access  Private (Patient only)
const createPatientProfile = async (req, res) => {
    try {
        const { dateOfBirth, gender, bloodGroup, allergies, medicalHistory, emergencyContact } = req.body;

        const existingProfile = await Patient.findOne({ firebaseId: req.user.firebaseId });
        if (existingProfile) {
            return res.status(400).json({ message: 'Profile already exists for this user.' });
        }

        const patient = new Patient({
            firebaseId: req.user.firebaseId,
            dateOfBirth,
            gender,
            bloodGroup,
            allergies,
            medicalHistory,
            emergencyContact
        });

        await patient.save();
        res.status(201).json(patient);
    } catch (error) {
        console.error('Error creating patient profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// @route   PUT /api/patients/profile
// @desc    Update patient medical profile
// @access  Private (Patient only)
const updatePatientProfile = async (req, res) => {
    try {
        const { dateOfBirth, gender, bloodGroup, allergies, medicalHistory, emergencyContact } = req.body;
        
        const patient = await Patient.findOne({ firebaseId: req.user.firebaseId });
        
        if (!patient) {
            return res.status(404).json({ message: 'Patient profile not found. Please create one first.' });
        }

        patient.dateOfBirth = dateOfBirth || patient.dateOfBirth;
        patient.gender = gender || patient.gender;
        patient.bloodGroup = bloodGroup || patient.bloodGroup;
        if (allergies) patient.allergies = allergies;
        if (medicalHistory) patient.medicalHistory = medicalHistory;
        if (emergencyContact) patient.emergencyContact = emergencyContact;
        
        await patient.save();
        res.status(200).json(patient);
    } catch (error) {
        console.error('Error updating patient profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { 
    getPatientProfile, 
    createPatientProfile,
    updatePatientProfile 
};