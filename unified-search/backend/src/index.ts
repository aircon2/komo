import "./config/env.js";
import express from "express";
import cors from "cors";
import searchRouter from "./routes/search.js";
import summarizeRouter from "./routes/summarize.js";
import cacheRouter from "./routes/cache.js";
import { buildOrUpdateCache } from "./modules/notion/utils/nocacheSync.js";


// create app
const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration - allow requests from frontend
const allowedOrigins = [
  'http://localhost:3000',
  'https://searchkomo.tech',
  'https://www.searchkomo.tech',
  'https://komosearch.tech',
  'https://www.komosearch.tech',
];

// Add FRONTEND_URL if set
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// simple test route
app.use("/api/cache", cacheRouter);
app.use("/api/search", searchRouter);
app.use("/api/summarize", summarizeRouter);






app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Build cache in background, but don't block server startup
// NOTE: Searches use the cached database (searchLocal) and do NOT call Notion API
// This cache update is optional and only runs if cache is empty or forced
if (!process.env.NOTION_SKIP_CACHE_BUILD) {
  buildOrUpdateCache().catch((error) => {
    // Don't crash server on cache build errors (rate limits, etc.)
    // Searches will still work using existing cache
    if (error.code === 'rate_limited') {
      console.warn("⚠️  Notion API rate limited. Searches will use existing cache (NO API calls during search).");
    } else {
      console.error("⚠️  Error building cache (server still running, searches use existing cache):", error.message);
    }
  });
} else {
  console.log("⏭️  Skipping cache build (NOTION_SKIP_CACHE_BUILD is set)");
  console.log("✅ Searches will use existing cached data - NO Notion API calls");
}