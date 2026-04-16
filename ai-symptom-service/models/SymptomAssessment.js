const mongoose = require("mongoose");

const symptomAssessmentSchema = new mongoose.Schema({
  patientId: {
    type: String,
    index: true
  },
  symptomsText: {
    type: String,
    required: true
  },
  input: {
    type: Object,
    default: {}
  },
  output: {
    type: Object,
    default: {}
  },
  providerRequested: {
    type: String,
    enum: ["auto", "openai", "claude"],
    default: "auto"
  },
  providerUsed: {
    type: String,
    enum: ["rule-based", "openai", "claude", "none"],
    default: "none"
  }
}, { timestamps: true });

module.exports = mongoose.model("SymptomAssessment", symptomAssessmentSchema);
