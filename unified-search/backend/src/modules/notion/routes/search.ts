import express from "express";
import { searchNotion } from "../services/notionService.js";
import { getNotionOAuthToken } from "../utils/tokenStore.js";

const router = express.Router();

/**
 * GET /notion/search?q=<query>&cursor=<cursor?>
 * Priority: 1. Header x-notion-token, 2. OAuth token, 3. env NOTION_TOKEN
 */
router.get("/", async (req, res) => {
  const q = String(req.query.q || "");
  const cursor = req.query.cursor as string | undefined;
  
  // Priority: header > OAuth token > env token
  const notionToken =
    (req.headers["x-notion-token"] as string) || 
    getNotionOAuthToken() || 
    process.env.NOTION_TOKEN;

  if (!notionToken) {
    return res.status(401).json({ 
      error: "Notion token missing. Please connect via OAuth first or provide x-notion-token header." 
    });
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