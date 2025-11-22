import express from "express";
import { searchLocal } from "../../../local/indexCache.js";

const router = express.Router();

/**
 * GET /notion/local-search?q=<query>
 * Uses SQLite database (searchLocal) to search cached Notion pages
 */
router.get("/", async (req, res) => {
  try {
    const q = String(req.query.q || "");

    if (!q) {
      return res.status(400).json({ error: "Missing search query" });
    }

    const results = searchLocal(q);
    
    // Transform SQL results to match SearchResult interface
    const formattedResults = results.map((row: any) => ({
      id: row.id,
      source: "notion" as const,
      title: row.title || "Untitled",
      url: row.url || "",
      content: row.content || "",
      metadata: {
        date: row.lastEditedTime || new Date().toISOString(),
      },
    }));

    res.json(formattedResults);
  } catch (error: any) {
    console.error("Local Notion search error:", error);
    res.status(500).json({ error: error.message || "Error searching local Notion cache" });
  }
});

export default router;

