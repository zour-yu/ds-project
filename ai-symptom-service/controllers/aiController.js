const SymptomAssessment = require("../models/SymptomAssessment");
const { recommendSpecialties } = require("../services/recommendationService");
const { generateAssessment } = require("../services/llmService");

const toSymptomsText = (symptoms) => {
  if (Array.isArray(symptoms)) return symptoms.join(", ");
  return String(symptoms || "").trim();
};

exports.analyzeSymptoms = async (req, res) => {
  try {
    const {
      patientId,
      symptoms,
      age,
      gender,
      medicalHistory,
      provider = "auto",
      persist = true
    } = req.body;

    const symptomsText = toSymptomsText(symptoms);
    if (!symptomsText || symptomsText.length < 5) {
      return res.status(400).json({ message: "Please provide meaningful symptom details" });
    }

    const recommendation = recommendSpecialties(symptomsText);
    const aiResult = await generateAssessment({
      provider,
      symptomsText,
      age,
      gender,
      medicalHistory
    });

    const merged = {
      likelyConditions: aiResult.assessment?.likelyConditions || [],
      recommendedSpecialty: aiResult.assessment?.recommendedSpecialty || recommendation.topSpecialties[0].specialty,
      urgency: aiResult.assessment?.urgency || recommendation.urgency,
      redFlags: aiResult.assessment?.redFlags || recommendation.redFlags,
      advice: aiResult.assessment?.advice || "Consult a licensed doctor for clinical diagnosis and treatment.",
      specialtyRanking: recommendation.topSpecialties
    };

    const payload = {
      disclaimer: "AI guidance only. Not a medical diagnosis.",
      providerRequested: provider,
      providerUsed: aiResult.assessment ? aiResult.providerUsed : "rule-based",
      aiError: aiResult.error,
      result: merged
    };

    if (persist) {
      await SymptomAssessment.create({
        patientId,
        symptomsText,
        input: { age, gender, medicalHistory },
        output: payload,
        providerRequested: provider,
        providerUsed: payload.providerUsed
      });
    }

    res.json(payload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const query = {};
    if (req.query.patientId) query.patientId = req.query.patientId;

    const history = await SymptomAssessment.find(query).sort({ createdAt: -1 }).limit(50);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
