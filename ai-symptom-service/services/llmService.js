const axios = require("axios");

const extractJson = (text) => {
  if (!text) return null;

  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch (error) {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1));
      } catch (innerError) {
        return null;
      }
    }
  }

  return null;
};

const buildPrompt = ({ symptomsText, age, gender, medicalHistory }) => {
  return [
    "You are a medical triage assistant. Return strict JSON only.",
    "Do not diagnose. Provide guidance only.",
    "JSON schema:",
    "{",
    '  "likelyConditions": ["..."],',
    '  "recommendedSpecialty": "...",',
    '  "urgency": "low|medium|high",',
    '  "redFlags": ["..."],',
    '  "advice": "..."',
    "}",
    `Symptoms: ${symptomsText}`,
    `Age: ${age || "unknown"}`,
    `Gender: ${gender || "unknown"}`,
    `Medical history: ${Array.isArray(medicalHistory) ? medicalHistory.join(", ") : (medicalHistory || "none")}`
  ].join("\n");
};

const callOpenAI = async (prompt) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      timeout: 20000
    }
  );

  const content = response.data?.choices?.[0]?.message?.content;
  const parsed = extractJson(content);
  if (!parsed) {
    throw new Error("OpenAI response was not valid JSON");
  }

  return parsed;
};

const callClaude = async (prompt) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const response = await axios.post(
    "https://api.anthropic.com/v1/messages",
    {
      model: process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest",
      max_tokens: 512,
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }]
    },
    {
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json"
      },
      timeout: 20000
    }
  );

  const content = response.data?.content?.[0]?.text;
  const parsed = extractJson(content);
  if (!parsed) {
    throw new Error("Claude response was not valid JSON");
  }

  return parsed;
};

const chooseProvider = (requestedProvider) => {
  if (requestedProvider === "openai" || requestedProvider === "claude") {
    return requestedProvider;
  }

  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.ANTHROPIC_API_KEY) return "claude";

  return null;
};

const generateAssessment = async ({ provider = "auto", symptomsText, age, gender, medicalHistory }) => {
  const selectedProvider = chooseProvider(provider);
  if (!selectedProvider) {
    return { providerUsed: "none", assessment: null, error: "No LLM API key configured" };
  }

  const prompt = buildPrompt({ symptomsText, age, gender, medicalHistory });

  try {
    if (selectedProvider === "openai") {
      const assessment = await callOpenAI(prompt);
      return { providerUsed: "openai", assessment, error: null };
    }

    const assessment = await callClaude(prompt);
    return { providerUsed: "claude", assessment, error: null };
  } catch (error) {
    return { providerUsed: selectedProvider, assessment: null, error: error.message };
  }
};

module.exports = {
  generateAssessment
};
