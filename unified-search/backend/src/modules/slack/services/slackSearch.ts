
import axios from "axios";
import { config } from "../../../config/env.js";


export interface SearchResult {
  id: string;
  source: "slack" | "notion" | "file";
  title: string;
  url: string;
  content: string;
  metadata: {
    author?: string;
    date: string;
    channel?: string;
  };
  thread?: {
    text: string;
    author: string;
    date: string;
  }[];
}


const SLACK_API_URL = "https://slack.com/api/search.messages";

/**
 * Calls Slack's search.messages endpoint.
 * 
 * @param query - The search string (e.g. "meeting", "meta", etc.)
 * @returns An array of normalized SearchResult objects
 */
export async function searchSlack(query: string) {
  try {
    console.log("Slack search called with query:", query);
    const response = await axios.post(
      SLACK_API_URL,
      new URLSearchParams({ query }), // Slack expects x-www-form-urlencoded
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${config.slackToken}`, // your xoxp-... token
        },
      }
    );

    if (!response.data.ok) {
      console.error("Slack API error:", response.data.error);
      throw new Error(response.data.error);
    }

    const matches = response.data.messages?.matches || [];
    console.log("Raw Slack matches:", matches);

    // ---- Normalize the Slack messages ----
    return matches.map((m: any) => ({
      source: "slack",
      user: m.username,
      channel: m.channel?.name,
      text: m.text?.trim(),
      link: m.permalink,
      attachments:
        m.attachments?.map((a: any) => ({
          title: a.title,
          url: a.original_url,
        })) || [],
      ts: m.ts,
    }));
  } catch (err: any) {
    console.error("Slack search failed:", err.message || err);

    return [];
  }
}

// export interface NotionSearchResponse {
//   hasMore: boolean;
//   nextCursor: string | null;
//   results: {
//     source: "notion";
//     id: string;
//     title: string;
//     url: string;
//     icon?: string;
//     content?: string; // Matching text snippet from page content
//     lastEditedTime: string;
//     createdTime: string;
//   }[];
// }

// export async function searchNotion(query: string): Promise<SearchResult[]> {
//   try {
//     const response = await fetch(`${API_BASE_URL}/notion/search?q=${encodeURIComponent(query)}`);

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || "Failed to search Notion");
//     }

//     const data: NotionSearchResponse = await response.json();
    
//     // Transform Notion results to match SearchResult interface
//     return data.results.map((item) => ({
//       id: item.id,
//       source: "notion" as const,
//       title: item.title,
//       url: item.url,
//       content: item.content || item.title, // Use content snippet if available, otherwise title
//       metadata: {
//         date: item.lastEditedTime,
//       },
//     }));
//   } catch (error) {
//     console.error("Notion search error:", error);
//     return [];
//   }
// }

