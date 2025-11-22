export interface SearchResult {
  id: string;
  source: "slack" | "notion" | "drive" | "gmail";
  title: string;
  url: string;
  content: string;
  metadata: {
    author?: string;
    date: string;
    channel?: string; // For Slack
    fileType?: string; // For files
  };
  thread?: {
    text: string;
    author: string;
    date: string;
  }[];
}
