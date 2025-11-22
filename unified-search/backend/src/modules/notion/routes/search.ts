import express from "express";
import { searchNotion } from "../services/notionService.js";

const router = express.Router();

/**
 * GET /notion/search?q=<query>&cursor=<cursor?>
 * Header: x-notion-token: <user_token>
 */
router.get("/", async (req, res) => {
  const q = String(req.query.q || "");
  const cursor = req.query.cursor as string | undefined;
  const notionToken =
    (req.headers["x-notion-token"] as string) || process.env.NOTION_TOKEN;

  if (!notionToken) {
    return res.status(401).json({ error: "Notion token missing" });
  }

  try {
    const data = await searchNotion(q, notionToken, cursor);
    res.json(data);
  } catch (error: any) {
    console.error("Notion search error:", error.message);
    res
      .status(500)
      .json({ error: error.message || "Error fetching Notion data" });
  }
});

export default router;