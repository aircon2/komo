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
  thread?: {
    text: string;
    author: string;
    date: string;
  }[];
}

export async function searchSlack(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/slack/search?q=${encodeURIComponent(query)}`);

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

export interface NotionSearchResponse {
  hasMore: boolean;
  nextCursor: string | null;
  results: {
    source: "notion";
    id: string;
    title: string;
    url: string;
    icon?: string;
    content?: string; // Matching text snippet from page content
    lastEditedTime: string;
    createdTime: string;
  }[];
}

export async function searchNotion(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/notion/search?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to search Notion");
    }

    const data: NotionSearchResponse = await response.json();
    
    // Transform Notion results to match SearchResult interface
    return data.results.map((item) => ({
      id: item.id,
      source: "notion" as const,
      title: item.title,
      url: item.url,
      content: item.content || item.title, // Use content snippet if available, otherwise title
      metadata: {
        date: item.lastEditedTime,
      },
    }));
  } catch (error) {
    console.error("Notion search error:", error);
    return [];
  }
}

