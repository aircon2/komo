import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../../config/env.js";

/**
 * Summarizes and categorizes a unified list of search results using Gemini.
 * @param query   The user’s search term ("signage")
 * @param results Normalized array (from normalizeResults)
 */
export async function summarizeSearchResults(query: string, results: any[]) {
  try {
    console.log("SSR called with", results.length, "results");
    console.log("Results sources:", results.map(r => r.source));
    
    // Filter out empty results and ensure we have valid content
    const validResults = results.filter(r => r && r.text && r.text.trim().length > 0);
    
    if (validResults.length === 0) {
      return {
        summary: [
          {
            topic: "No Results",
            summary: "No matching content found for your search query.",
            references: []
          }
        ]
      };
    }

    console.log("Valid results for summary:", validResults.length, "items");
    console.log("Sources breakdown:", validResults.reduce((acc, r) => {
      acc[r.source] = (acc[r.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>));

    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite", // or "gemini-1.5-pro" for higher reasoning
    });

    // Prepare context for the model - extract snippets around query for better context
    const formatted = validResults
      .map(
        (r, i) => {
          // Extract snippet around query if possible, otherwise first 500 chars
          let contentSnippet = r.text || "";
          const queryLower = query.toLowerCase();
          const textLower = contentSnippet.toLowerCase();
          const matchIndex = textLower.indexOf(queryLower);
          
          if (matchIndex !== -1) {
            // Extract 200 chars around the match
            const start = Math.max(0, matchIndex - 200);
            const end = Math.min(contentSnippet.length, matchIndex + query.length + 200);
            contentSnippet = contentSnippet.substring(start, end);
            if (start > 0) contentSnippet = "..." + contentSnippet;
            if (end < (r.text || "").length) contentSnippet = contentSnippet + "...";
          } else {
            // No match, just take first 500 chars
            contentSnippet = contentSnippet.substring(0, 500);
            if ((r.text || "").length > 500) contentSnippet += "...";
          }
          
          return `${i + 1}. [${r.source}] ${r.title || "Untitled"}\n` +
            `   URL: ${r.link || r.url || "none"}\n` +
            `   Content: ${contentSnippet}\n`;
        }
      )
      .join("\n");

    const prompt = `
You are an AI that summarizes and categorizes search results.

Given the following content about the query "${query}", group related mentions by topic/context and create short 10–20 word summaries. 

IMPORTANT RULES:
1. The "references" field must contain the actual URL strings from the "URL:" field in each result, NOT the item numbers. Each reference must be a complete URL string. You must always include references in a summary.
2. DO NOT mention file types (like MP4, PDF, PNG) unless the content explicitly describes an actual file that exists. If content just mentions file types in examples or documentation, do not include them in summaries.
3. Only summarize actual content found, not metadata or examples.

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
    // Create a map of index -> URL for quick lookup (use validResults indices)
    const urlMap = new Map(
      validResults.map((r, i) => [String(i + 1), r.link || r.url || null])
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
