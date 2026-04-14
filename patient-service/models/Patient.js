const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: { type: String, required: true }
}, { _id: false });

const medicalHistorySchema = new mongoose.Schema({
    condition: { type: String, required: true },
    diagnosedDate: { type: Date },
    notes: { type: String }
}, { _id: false });

const patientSchema = new mongoose.Schema({
    // Primary link to the auth-service Identity (from Firebase)
    firebaseId: { 
        type: String, 
        required: true, 
        unique: true,
        index: true 
    },
    // Patient specific domain data
    dateOfBirth: { 
        type: Date 
    },
    gender: { 
        type: String, 
        enum: ['Male', 'Female', 'Other', 'Prefer Not To Say'],
        default: 'Prefer Not To Say'
    },
    bloodGroup: { 
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
        default: 'Unknown'
    },
    allergies: [{ 
        type: String 
    }],
    medicalHistory: [medicalHistorySchema],
    emergencyContact: emergencyContactSchema
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
