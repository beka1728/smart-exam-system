import { GoogleGenAI } from "@google/genai";

// Using Gemini 2.5 Flash for AI-powered exam features
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateQuestionVariant(
  baseQuestion: string,
  difficulty: string,
  subject: string,
  studentSeed: string
): Promise<{
  content: string;
  options?: string[];
  correctAnswer: string;
}> {
  try {
    const systemPrompt = `You are an expert educational content creator. Create a semantically equivalent question variant that tests the same concept but with different wording, examples, or context. Maintain the same difficulty level: ${difficulty}. Use seed: ${studentSeed} for consistent variations for the same student. Respond with JSON in this format: { "content": "question text", "options": ["A", "B", "C", "D"], "correctAnswer": "correct option text" }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            content: { type: "string" },
            options: { type: "array", items: { type: "string" } },
            correctAnswer: { type: "string" },
          },
          required: ["content", "correctAnswer"],
        },
      },
      contents: `Subject: ${subject}\nBase Question: ${baseQuestion}\nCreate a variant that tests the same knowledge but with different presentation.`,
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    console.error("Failed to generate question variant:", error);
    throw new Error("Failed to generate question variant: " + (error as Error).message);
  }
}

export async function scoreShortAnswer(
  question: string,
  studentAnswer: string,
  rubric: string,
  maxPoints: number
): Promise<{
  score: number;
  feedback: string;
  isCorrect: boolean;
}> {
  try {
    const systemPrompt = `You are an expert educator grading short answer questions. Evaluate the student's response based on the rubric and assign a score out of ${maxPoints} points. Respond with JSON in this format: { "score": number, "feedback": "detailed feedback", "isCorrect": boolean }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            score: { type: "number" },
            feedback: { type: "string" },
            isCorrect: { type: "boolean" },
          },
          required: ["score", "feedback", "isCorrect"],
        },
      },
      contents: `Question: ${question}\nStudent Answer: ${studentAnswer}\nRubric: ${rubric}\nMax Points: ${maxPoints}`,
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    console.error("Failed to score short answer:", error);
    throw new Error("Failed to score short answer: " + (error as Error).message);
  }
}

export async function detectAnomalousPatterns(
  sessionData: {
    studentId: string;
    timeSpent: number[];
    answerPattern: string[];
    deviceChanges: number;
  }
): Promise<{
  anomalies: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    recommendation: string;
  }>;
  riskScore: number;
}> {
  try {
    const systemPrompt = `You are an AI proctor analyzing exam session data for suspicious patterns. Identify potential academic integrity issues and provide actionable recommendations. Consider rapid answer bursts, identical phrasing patterns, device switching, and unusual timing patterns. Respond with JSON in this format: { "anomalies": [{"type": "string", "severity": "low|medium|high", "description": "string", "recommendation": "string"}], "riskScore": number_0_to_100 }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            anomalies: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  severity: { type: "string", enum: ["low", "medium", "high"] },
                  description: { type: "string" },
                  recommendation: { type: "string" },
                },
                required: ["type", "severity", "description", "recommendation"],
              },
            },
            riskScore: { type: "number" },
          },
          required: ["anomalies", "riskScore"],
        },
      },
      contents: `Session Data: ${JSON.stringify(sessionData)}`,
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    console.error("Failed to detect anomalous patterns:", error);
    throw new Error("Failed to detect anomalous patterns: " + (error as Error).message);
  }
}

export async function generateExamSummary(
  examResults: Array<{
    studentId: string;
    score: number;
    timeSpent: number;
    flaggedActivities: any[];
  }>
): Promise<{
  overallPerformance: string;
  integrityAssessment: string;
  recommendations: string[];
}> {
  try {
    const systemPrompt = `You are an educational analytics expert. Analyze exam results and provide insights for instructors. Focus on performance patterns, potential integrity issues, and actionable recommendations. Respond with JSON in this format: { "overallPerformance": "summary", "integrityAssessment": "integrity analysis", "recommendations": ["rec1", "rec2"] }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            overallPerformance: { type: "string" },
            integrityAssessment: { type: "string" },
            recommendations: { type: "array", items: { type: "string" } },
          },
          required: ["overallPerformance", "integrityAssessment", "recommendations"],
        },
      },
      contents: `Exam Results: ${JSON.stringify(examResults)}`,
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    console.error("Failed to generate exam summary:", error);
    throw new Error("Failed to generate exam summary: " + (error as Error).message);
  }
}
