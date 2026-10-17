import axios from "axios";
import Doctor from "../models/doctorModel.js";

const VALID_SPECIALISTS = [
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist",
];

/**
 * Call Gemini AI for specialist recommendation
 */
const callGeminiSpecialist = async (symptoms) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const prompt = `You are an expert clinical triage AI.
The patient presents with the following symptoms: ${symptoms.join(", ")}.
Select the single best medical specialty from this exact list:
${VALID_SPECIALISTS.map((s) => `- ${s}`).join("\n")}

Respond with ONLY the exact specialty name from the list above and absolutely nothing else.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const text = (
      data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
    ).trim();

    const match =
      VALID_SPECIALISTS.find(
        (s) => s.toLowerCase() === text.toLowerCase()
      ) ||
      VALID_SPECIALISTS.find((s) =>
        text.toLowerCase().includes(s.toLowerCase())
      );

    return match || null;
  } catch (err) {
    console.error("Gemini triage error:", err.message);
    return null;
  }
};

/**
 * Call ML server with retry (handles Render cold start)
 */
const callML = async (symptoms) => {
  const base = process.env.ML_API_URL?.replace(/\/$/, "");
  if (!base) {
    throw new Error("ML_API_URL not configured");
  }

  const url = `${base}/predict`;
  let lastError;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await axios.post(
        url,
        { symptoms },
        { timeout: 8000 }
      );

      if (!res.data || !res.data.recommended_specialist) {
        throw new Error("Invalid ML response format");
      }

      return res.data.recommended_specialist;
    } catch (err) {
      lastError = err;
      console.log(`ML attempt ${attempt} failed →`, err.code || err.message);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  throw lastError;
};

/**
 * Recommend doctors using ML specialization with Gemini fallback
 */
export const recommendDoctor = async (req, res) => {
  try {
    let { symptoms } = req.body;

    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No symptoms provided",
      });
    }

    // Sanitize symptoms
    symptoms = symptoms.map((s) => String(s).trim().toLowerCase());
    console.log("Symptoms for triage:", symptoms);

    let specialist = null;

    // 1. Try Gemini AI first if configured (fastest & high accuracy)
    if (process.env.GEMINI_API_KEY) {
      specialist = await callGeminiSpecialist(symptoms);
      if (specialist) {
        console.log("Gemini predicted specialist:", specialist);
      }
    }

    // 2. Fallback to Python ML service if Gemini was not used
    if (!specialist) {
      try {
        specialist = await callML(symptoms);
        console.log("ML predicted specialist:", specialist);
      } catch (mlErr) {
        console.log("ML service unavailable, using clinical rule fallback");
      }
    }

    // 3. Fallback to General physician
    if (!specialist) {
      specialist = "General physician";
    }

    // DB search for matching doctors
    const doctors = await Doctor.find({
      speciality: { $regex: new RegExp(`^${specialist}$`, "i") },
    }).limit(6);

    return res.json({
      success: true,
      specialist,
      doctors,
    });
  } catch (error) {
    console.error("Recommend controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Triage error",
    });
  }
};
