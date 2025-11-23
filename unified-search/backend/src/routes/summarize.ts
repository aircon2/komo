
import express from "express";
import { searchSlack } from "../modules/slack/services/slackSearch.js";
import { searchLocal } from "../local/indexCache.js";
import { normalizeResults } from "../shared/utils/normalizeResults.js";
import { summarizeSearchResults } from "../shared/services/summarizeService.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const q = String(req.query.q || "");
  // Get active apps from query params (comma-separated: "slack,notion" or "slack" or "notion")
  const sourcesParam = String(req.query.sources || "slack,notion");
  const activeSources = sourcesParam.split(",").map(s => s.trim().toLowerCase());

  try {
    // 1️⃣ Perform unified search
    const { unifiedSearch } = await import("../shared/services/unifiedSearch.js");

    const allResults = await unifiedSearch(q);
    
    // 2️⃣ Filter results based on active apps
    const filteredResults = allResults.filter(result => {
      if (result.source === "slack" && !activeSources.includes("slack")) return false;
      if (result.source === "notion" && !activeSources.includes("notion")) return false;
      return true;
    });
    
    console.log(`Summary: Filtered ${allResults.length} results to ${filteredResults.length} based on sources: ${activeSources.join(", ")}`);
    
    const {summarizeSearchResults} = await import("../shared/services/summarizeService.js");
    const summary = await summarizeSearchResults(q, filteredResults);
    console.log("Summary:", JSON.stringify(summary, null, 2)); 



    // 2️⃣ Generate summary JSON via AI
    // const summary = await summarizeSearchResults(q, normalized);

    // 3️⃣ Send back
    res.json({ query: q, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to summarize results" });
  }
});

export default router;