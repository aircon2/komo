import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../../config/env.js";

/**
 * Summarizes and categorizes a unified list of search results using Gemini.
 * @param query   The user’s search term ("signage")
 * @param results Normalized array (from normalizeResults)
 */
export async function summarizeSearchResults(query: string, results: any[]) {
  try {
    console.log("SSR called");
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite", // or "gemini-1.5-pro" for higher reasoning
    });

    // Prepare context for the model
    const formatted = results
      .map(
        (r, i) =>
          `${i + 1}. [${r.source}] ${r.title || ""}\n` +
          `   URL: ${r.url || "none"}\n` +
          `   Content: ${r.text || ""}\n`
      )
      .join("\n");

    const prompt = `
You are an AI that summarizes and categorizes search results.

Given the following content about the query "${query}", group related mentions by topic/context and create short 10–20 word summaries. 

IMPORTANT: The "references" field must contain the actual URL strings from the "URL:" field in each result, NOT the item numbers. Each reference must be a complete URL string. You must always include references in a summary.

Respond strictly in valid JSON format like this:

{
  "summary": [
    {
      "topic": "<Category Label>",
      "summary": "<10–20 word summary>",
      "references": ["https://example.com/page1", "https://example.com/page2"]
    }
  ]
}

Example: If a result shows "URL: https://notion.so/page123", use "https://notion.so/page123" in references, NOT "1" or the item number.

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

    // Post-process: Convert number references to actual URLs
    // Create a map of index -> URL for quick lookup
    const urlMap = new Map(
      results.map((r, i) => [String(i + 1), r.url || null])
    );

    if (parsed.summary && Array.isArray(parsed.summary)) {
      parsed.summary = parsed.summary.map((item: any) => {
        if (item.references && Array.isArray(item.references)) {
          item.references = item.references.map((ref: string) => {
            // If reference is a number (string or number), convert to URL
            const numRef = String(ref).trim();
            if (urlMap.has(numRef)) {
              return urlMap.get(numRef);
            }
            // If it's already a URL, keep it as is
            return ref;
          }).filter((url: string | null) => url !== null); // Remove nulls
        }
        return item;
      });
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
