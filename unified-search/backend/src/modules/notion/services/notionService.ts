import { Client } from "@notionhq/client";
import { getAllBlocks } from "./deepNotionService.js";
import { extractBlockText } from "./deepNotionService.js";

export const searchNotion = async (
  query: string,
  notionToken: string,
  cursor?: string
) => {
  const notion = new Client({ auth: notionToken });
  const lowerQuery = query.toLowerCase();

  // First, search for pages that might match
  const response = await notion.search({
    query,
    start_cursor: cursor,
    page_size: 10,
    sort: { direction: "descending", timestamp: "last_edited_time" },
  });

  const results = await Promise.all(
    response.results.map(async (item: any) => {
      if (item.object !== "page") {
        // Skip non-page items
        return null;
      }

      const id = item.id;
      const url = item.url;
      const icon =
        item.icon?.emoji ||
        item.icon?.external?.url ||
        item.icon?.file?.url ||
        "📄";

      // Extract title safely
      let title = "Untitled";
      const props = (item as any).properties || {};
      const titleProp = Object.values(props).find(
        (p: any) => p.type === "title"
      ) as any;

      if (titleProp && titleProp.title?.[0]) {
        title = titleProp.title[0].plain_text;
      }

      // Check if query matches title
      const titleMatch = title.toLowerCase().includes(lowerQuery);
      
      // Get full page content for testing
      let fullContent = "";
      let hasContentMatch = false;
      try {
        const blocks = await getAllBlocks(notion, id);
        
        // Extract all text from all blocks
        const allText = blocks.map(block => extractBlockText(block)).filter(text => text.trim().length > 0);
        fullContent = allText.join("\n\n");
        
        // Check if query matches anywhere in content
        hasContentMatch = fullContent.toLowerCase().includes(lowerQuery);
      } catch (error) {
        // If we can't fetch blocks, just use title match
        console.warn(`Could not fetch blocks for page ${id}:`, error);
        fullContent = "";
      }

      // Only return pages that match in title or content
      if (titleMatch || hasContentMatch) {
        return {
          source: "notion",
          id,
          title,
          url,
          icon,
          content: fullContent || title, // Return full content if available, otherwise title
          lastEditedTime: item.last_edited_time,
          createdTime: item.created_time,
        };
      }

      return null;
    })
  );

  // Filter out null results
  const filteredResults = results.filter((r) => r !== null);

  return {
    hasMore: response.has_more,
    nextCursor: response.next_cursor,
    results: filteredResults,
  };
};