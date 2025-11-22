// src/routes/search.ts
import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  const query = (req.query.q as string) || "";

  try {
    // Lazy dynamic import fixes circular/loader timing problems
    const { unifiedSearch } = await import("../shared/services/unifiedSearch.js");

    const results = await unifiedSearch(query);
    res.json(results);
  } catch (err) {
    console.error("Unified search route error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;