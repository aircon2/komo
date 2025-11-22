import { WebClient } from "@slack/web-api";
import { SearchResult } from "../../../shared/types/SearchResult.js";

export class SlackService {
  private getClient(token: string): WebClient {
    return new WebClient(token);
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const client = this.getClient(token);
      const response = await client.auth.test();
      return response.ok === true;
    } catch (error) {
      console.error("Slack token verification failed:", error);
      return false;
    }
  }

  async search(token: string, query: string): Promise<SearchResult[]> {
    const client = this.getClient(token);
    
    try {
      const response = await client.search.messages({
        query,
        sort: "score", // or 'timestamp'
        count: 20,
      });

      if (!response.messages || !response.messages.matches) {
        return [];
      }

      return response.messages.matches.map((match: any) => ({
        id: match.iid || match.ts,
        source: "slack",
        title: match.channel?.name ? `#${match.channel.name}` : "Direct Message",
        url: match.permalink,
        content: match.text,
        metadata: {
          author: match.username,
          date: new Date(parseFloat(match.ts) * 1000).toISOString(),
          channel: match.channel?.name,
        },
      }));
    } catch (error) {
      console.error("Slack search failed:", error);
      throw new Error("Failed to search Slack");
    }
  }
}

export const slackService = new SlackService();

