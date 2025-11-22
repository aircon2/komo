import express from "express";
import { Client } from "@notionhq/client";

const router = express.Router();

/**
 * GET /notion/search?q=<query>&cursor=<cursor?>
 * Header: x-notion-token: <user_token>
 */
router.get("/", async (req, res) => {
  const query = String(req.query.q || "");
  const cursor = req.query.cursor as string | undefined;
  const notionToken = (req.headers["x-notion-token"] as string) || process.env.NOTION_TOKEN;

  if (!notionToken) {
    return res.status(401).json({ error: "Notion token missing" });
  }

  try {
    const notion = new Client({ auth: notionToken });

    const response = await notion.search({
      query,
      page_size: 10,
      start_cursor: cursor,
      sort: { direction: "descending", timestamp: "last_edited_time" }
    });

    const pages = response.results.map((block: any) => {
      const id = block.id;
      const url = (block as any).url;
      const icon =
        (block as any).icon?.emoji ||
        (block as any).icon?.external?.url ||
        (block as any).icon?.file?.url ||
        "📄";

      // Grab title
      let title = "Untitled";
      const properties = (block as any).properties || {};
      const titleProp = Object.values(properties).find(
        (prop: any) => prop.type === "title"
      ) as any;

      if (titleProp && titleProp.title?.length > 0) {
        title = titleProp.title[0].plain_text;
      }

      return { id, title, url, icon };
    });

    res.json({
      hasMore: response.has_more,
      nextCursor: response.next_cursor,
      results: pages
    });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message || "Error fetching Notion data" });
  }
});

export default router;