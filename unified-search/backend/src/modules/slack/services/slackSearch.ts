import axios from "axios";
import { config } from "../../../config/env.js";
import { SearchResult } from "../../../shared/types/SearchResult.js";

const SLACK_API_URL = "https://slack.com/api/search.messages";
const SLACK_THREAD_URL = "https://slack.com/api/conversations.replies";

/**
 * Fetch a message’s thread replies using channel + ts.
 */
async function fetchThread(channelId: string, ts: string) {
  try {
    const response = await axios.get(SLACK_THREAD_URL, {
      headers: { Authorization: `Bearer ${config.slackToken}` },
      params: { channel: channelId, ts },
    });

    if (!response.data.ok) {
      console.warn(
        "Slack conversations.replies error:",
        response.data.error || "unknown"
      );
      return [];
    }

    // Skip index 0 because Slack returns the parent message again
    const replies = response.data.messages.slice(1);
    return replies.map((r: any) => ({
      text: r.text || "",
      author: r.user || "unknown",
      date: new Date(parseFloat(r.ts) * 1000).toISOString(),
    }));
  } catch (err: any) {
    console.error("fetchThread error:", err.message);
    return [];
  }
}

/**
 * Calls Slack's search.messages and includes threaded replies in the result.
 */
export async function searchSlack(query: string): Promise<SearchResult[]> {
  try {
    console.log("Slack search called with query:", query);

    const resp = await axios.post(
      SLACK_API_URL,
      new URLSearchParams({ query, count: "5" }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${config.slackToken}`,
        },
      }
    );

    if (!resp.data.ok) throw new Error(resp.data.error);

    const matches = resp.data.messages?.matches || [];
    console.log(`Slack returned ${matches.length} matches`);

    // Fetch threads for every message in parallel
    const results: SearchResult[] = await Promise.all(
      matches.map(async (m: any) => {
        const author = m.username || m.user || "Unknown";
        const date = new Date(parseFloat(m.ts) * 1000).toISOString();
        const channelId = m.channel?.id;
        const thread =
          channelId && m.ts ? await fetchThread(channelId, m.ts) : [];

        return {
          id: m.ts,
          source: "slack",
          title:
            m.text?.split("\n")[0]?.slice(0, 60) || "Untitled Slack Message",
          url: m.permalink,
          content: m.text?.trim() || "",
          metadata: {
            author,
            date,
            channel: m.channel?.name,
          },
          thread,
        };
      })
    );

    // Pretty‑print threads for easier inspection
    console.log(
      "Normalized Slack results:",
      JSON.stringify(results, null, 2)
    );

    return results;
  } catch (err: any) {
    console.error("Slack search failed:", err.message);
    return [];
  }
}