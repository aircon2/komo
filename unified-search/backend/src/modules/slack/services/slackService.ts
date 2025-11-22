import { WebClient } from "@slack/web-api";
import { SearchResult } from "../../../shared/types/SearchResult.js";

export class SlackService {
  private userCache: Map<string, string> = new Map();

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

  private async resolveUserName(client: WebClient, userId: string): Promise<string> {
    if (this.userCache.has(userId)) {
      return this.userCache.get(userId)!;
    }

    try {
      const result = await client.users.info({ user: userId });
      const name = result.user?.real_name || result.user?.name || userId;
      this.userCache.set(userId, name);
      return name;
    } catch (e) {
      return userId;
    }
  }

  private async formatMessageText(client: WebClient, text: string): Promise<string> {
    if (!text) return "";
    
    const mentionRegex = /<@([A-Z0-9]+)(\|([^>]+))?>/g;
    const matches = [...text.matchAll(mentionRegex)];
    
    if (matches.length === 0) return text;

    const replacements = new Map<string, string>();

    for (const match of matches) {
      const fullMatch = match[0];
      const userId = match[1];
      const nameInMatch = match[3]; 

      if (!replacements.has(fullMatch)) {
        if (nameInMatch) {
          replacements.set(fullMatch, `@${nameInMatch}`);
        } else {
          const name = await this.resolveUserName(client, userId);
          replacements.set(fullMatch, `@${name}`);
        }
      }
    }

    let formattedText = text;
    replacements.forEach((replacement, original) => {
       formattedText = formattedText.split(original).join(replacement);
    });

    return formattedText;
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

      const results = await Promise.all(response.messages.matches.map(async (match: any) => {
        let threadMessages: any[] = [];

        console.log(`Processing match ${match.ts}`);

        let threadTs = match.thread_ts;
        
        if (!threadTs && match.permalink) {
            try {
                const url = new URL(match.permalink);
                const threadTsParam = url.searchParams.get("thread_ts");
                if (threadTsParam) {
                    threadTs = threadTsParam;
                }
            } catch (e) { }
        }

        const targetTs = threadTs || match.ts;
        const channelId = match.channel?.id;

        if (channelId) {
          try {
            const threadResponse = await client.conversations.replies({
              channel: channelId,
              ts: targetTs,
              limit: 10,
            });
            
            if (threadResponse.messages && threadResponse.messages.length > 1) {
               console.log(`Thread found with ${threadResponse.messages.length} messages`);
              
              threadMessages = await Promise.all(threadResponse.messages.map(async (msg: any) => {
                const authorName = await this.resolveUserName(client, msg.user || msg.username || "Unknown");
                const formattedText = await this.formatMessageText(client, msg.text || "");
                return {
                  text: formattedText,
                  author: authorName,
                  date: new Date(parseFloat(msg.ts) * 1000).toISOString(),
                };
              }));
            } 
          } catch (threadError) { }
        }

        const authorName = match.username || match.user || "Unknown";
        // Also format the main message text
        const mainText = await this.formatMessageText(client, match.text || "");

        return {
          id: match.iid || match.ts,
          source: "slack" as const, 
          title: match.channel?.name ? `#${match.channel.name}` : "Direct Message",
          url: match.permalink,
          content: mainText,
          metadata: {
            author: authorName,
            date: new Date(parseFloat(match.ts) * 1000).toISOString(),
            channel: match.channel?.name,
          },
          thread: threadMessages.length > 0 ? threadMessages : undefined
        };
      }));

      return results;
    } catch (error) {
      console.error("Slack search failed:", error);
      throw new Error("Failed to search Slack");
    }
  }
}

export const slackService = new SlackService();
