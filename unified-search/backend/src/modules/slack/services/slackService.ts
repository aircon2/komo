import { WebClient } from "@slack/web-api";

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

// User cache to avoid repeated API calls
const userCache: Record<string, string> = {};

async function resolveUserName(client: WebClient, userId: string): Promise<string> {
  if (userCache[userId]) {
    return userCache[userId];
  }

  try {
    const userInfo = await client.users.info({ user: userId });
    const name = userInfo.user?.real_name || userInfo.user?.name || userId;
    userCache[userId] = name;
    return name;
  } catch (error) {
    console.warn(`Failed to resolve user ${userId}:`, error);
    return userId;
  }
}

function formatMessageText(text: string): string {
  // Replace <@U123456|DisplayName> or <@U123456> with @DisplayName
  return text.replace(/<@([A-Z0-9]+)(?:\|([^>]+))?>/g, (match, userId, displayName) => {
    return displayName ? `@${displayName}` : `@${userId}`;
  });
}

export const slackService = {
  async search(token: string, query: string): Promise<SearchResult[]> {
    const client = new WebClient(token);

    try {
      // Search for messages
      const searchResponse = await client.search.messages({
        query,
        count: 20,
      });

      if (!searchResponse.messages?.matches) {
        return [];
      }

      const results: SearchResult[] = [];

      for (const match of searchResponse.messages.matches) {
        if (!match.ts || !match.text) continue;

        // Extract thread_ts from permalink or use ts
        let threadTs: string | undefined;
        if (match.permalink) {
          const threadMatch = match.permalink.match(/thread_ts=([0-9.]+)/);
          if (threadMatch) {
            threadTs = threadMatch[1];
          }
        }
        if (!threadTs) {
          threadTs = match.ts;
        }

        // Get channel info
        const channelId = match.channel?.id;
        const channelName = match.channel?.name || "unknown";

        // Get user info
        const userId = match.user || "";
        const authorName = userId ? await resolveUserName(client, userId) : "Unknown";

        // Format message text
        const formattedText = formatMessageText(match.text);

        // Fetch thread replies if this is part of a thread
        const threadMessages: { text: string; author: string; date: string }[] = [];
        
        if (threadTs && channelId) {
          try {
            const repliesResponse = await client.conversations.replies({
              channel: channelId,
              ts: threadTs,
            });

            if (repliesResponse.messages && repliesResponse.messages.length > 1) {
              // Skip the first message (it's the parent)
              for (const reply of repliesResponse.messages.slice(1)) {
                if (reply.ts && reply.text && reply.user) {
                  const replyAuthor = await resolveUserName(client, reply.user);
                  threadMessages.push({
                    text: formatMessageText(reply.text),
                    author: replyAuthor,
                    date: new Date(parseFloat(reply.ts) * 1000).toISOString(),
                  });
                }
              }
            }
          } catch (error) {
            console.warn(`Failed to fetch thread replies for ${threadTs}:`, error);
          }
        }

        results.push({
          id: match.ts,
          source: "slack",
          title: `Message in #${channelName}`,
          url: match.permalink || "",
          content: formattedText,
          metadata: {
            author: authorName,
            date: new Date(parseFloat(match.ts) * 1000).toISOString(),
            channel: channelName,
          },
          thread: threadMessages.length > 0 ? threadMessages : undefined,
        });
      }

      return results;
    } catch (error: any) {
      console.error("Slack search error:", error);
      throw new Error(error.message || "Failed to search Slack");
    }
  },
};
