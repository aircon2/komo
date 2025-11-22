import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../../config/env.js";

/**
 * Summarizes and categorizes a unified list of search results using Gemini.
 * @param query   The user’s search term ("signage")
 * @param results Normalized array (from normalizeResults)
 */
export async function summarizeSearchResults(query: string, results: any[]) {
  try {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash" // or "gemini-1.5-pro" for higher reasoning
    });

    // Prepare context for the model
    const formatted = results
      .map(
        (r: any, i: number) =>
          `${i + 1}. [${r.source}] ${r.title || ""} — ${r.text || ""} ${
            r.link ? `(Link: ${r.link})` : ""
          }`
      )
      .join("\n");

    const prompt = `
You are an AI that summarizes and categorizes search results.

Given the following content about the query "${query}", group related mentions by topic/context and create short 10–20 word summaries. 

Respond strictly in valid JSON format like this:

{
  "summary": [
    {
      "topic": "<Category Label>",
      "summary": "<10–20 word summary>",
      "references": ["<url1>", "<url2>"]
    }
  ]
}

References:
${formatted}
`;

    const result = await model.generateContent(prompt);

    const text = result.response
      ?.text()
      ?.trim()
      // remove code fences if Gemini wraps JSON in ```json blocks
      .replace(/^```json/g, "")
      .replace(/^```/g, "")
      .replace(/```$/g, "")
      .trim();

    // Try parse to JSON
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Fallback in case Gemini adds extra info
      parsed = {
        summary: [
          {
            topic: "Parsing error",
            summary: "Gemini returned non‑JSON output",
            raw: text,
          },
        ],
      };
    }

    return parsed;
  } catch (err) {
    console.error("Gemini summarization error:", err);
    return {
      summary: [
        {
          topic: "Error",
          summary: "Failed to generate summary",
          error: String(err),
        },
      ],
    };
  }
}