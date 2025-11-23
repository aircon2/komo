// src/routes/search.ts
import express from "express";
const router = express.Router();

// Simple in-memory cache for recent searches (clears after 30 seconds)
const searchCache = new Map<string, { results: any[]; timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds

router.get("/", async (req, res) => {
  const query = (req.query.q as string) || "";
  
  // Skip empty queries
  if (!query.trim()) {
    return res.json([]);
  }

  // Check cache first for real-time search optimization
  const cacheKey = query.toLowerCase().trim();
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("📦 Cache hit for query:", query);
    return res.json(cached.results);
  }

  try {
    console.log("🔍 Search route called with query:", query);
    // Lazy dynamic import fixes circular/loader timing problems
    const { unifiedSearch } = await import("../shared/services/unifiedSearch.js");

    const results = await unifiedSearch(query);
    
    // Cache the results
    searchCache.set(cacheKey, { results, timestamp: Date.now() });
    
    // Clean up old cache entries periodically
    if (searchCache.size > 100) {
      const now = Date.now();
      for (const [key, value] of searchCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          searchCache.delete(key);
        }
      }
    }
    
    res.json(results);
  } catch (err) {
    console.error("Unified search route error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;