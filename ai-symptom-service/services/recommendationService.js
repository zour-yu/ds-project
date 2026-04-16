const SPECIALTY_KEYWORDS = {
  Cardiology: ["chest pain", "palpitation", "shortness of breath", "high blood pressure", "fainting"],
  Dermatology: ["rash", "itching", "acne", "eczema", "skin", "hives"],
  Neurology: ["headache", "migraine", "seizure", "numbness", "vertigo", "dizziness"],
  Gastroenterology: ["abdominal pain", "diarrhea", "constipation", "vomiting", "nausea", "bloating"],
  Pulmonology: ["cough", "wheezing", "breathing", "asthma", "phlegm", "sputum"],
  Orthopedics: ["joint pain", "back pain", "knee pain", "fracture", "swelling", "stiffness"],
  ENT: ["sore throat", "ear pain", "sinus", "hearing", "tonsil", "runny nose"],
  Psychiatry: ["anxiety", "depression", "panic", "insomnia", "stress", "mood"],
  "General Medicine": ["fever", "fatigue", "weakness", "body ache", "infection"]
};

const RED_FLAG_KEYWORDS = [
  "severe chest pain",
  "blood in vomit",
  "blood in stool",
  "fainting",
  "slurred speech",
  "confusion",
  "seizure",
  "shortness of breath"
];

const normalize = (input) => String(input || "").toLowerCase();

const recommendSpecialties = (symptomsText) => {
  const normalized = normalize(symptomsText);
  const scores = {};

  Object.entries(SPECIALTY_KEYWORDS).forEach(([specialty, keywords]) => {
    const matched = keywords.filter((keyword) => normalized.includes(keyword));
    if (matched.length > 0) {
      scores[specialty] = {
        score: matched.length,
        matchedKeywords: matched
      };
    }
  });

  const ranked = Object.entries(scores)
    .map(([specialty, details]) => ({ specialty, ...details }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const redFlags = RED_FLAG_KEYWORDS.filter((keyword) => normalized.includes(keyword));

  let urgency = "low";
  if (redFlags.length > 0) {
    urgency = "high";
  } else if (normalized.includes("pain") || normalized.includes("fever")) {
    urgency = "medium";
  }

  return {
    topSpecialties: ranked.length > 0 ? ranked : [{ specialty: "General Medicine", score: 1, matchedKeywords: [] }],
    urgency,
    redFlags
  };
};

module.exports = {
  recommendSpecialties
};
