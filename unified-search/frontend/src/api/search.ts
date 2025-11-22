const API_BASE_URL = "http://localhost:4000";

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
}

export async function searchSlack(query: string, token: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/slack/search?q=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to search Slack");
    }

    return await response.json();
  } catch (error) {
    console.error("Slack search error:", error);
    return [];
  }
}

