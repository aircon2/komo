import { Client } from "@notionhq/client";

export const searchNotion = async (
  query: string,
  notionToken: string,
  cursor?: string
) => {
  const notion = new Client({ auth: notionToken });

  const response = await notion.search({
    query,
    start_cursor: cursor,
    page_size: 10,
    sort: { direction: "descending", timestamp: "last_edited_time" },
  });

  const results = response.results.map((item: any) => {
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

    return {
      source: "notion",
      id,
      title,
      url,
      icon,
      lastEditedTime: item.last_edited_time,
      createdTime: item.created_time,
    };
  });

  return {
    hasMore: response.has_more,
    nextCursor: response.next_cursor,
    results,
  };
};