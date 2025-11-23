
import express from "express";
import { searchSlack } from "../modules/slack/services/slackSearch.js";
import { searchLocal } from "../local/indexCache.js";
import { normalizeResults } from "../shared/utils/normalizeResults.js";
import { summarizeSearchResults } from "../shared/services/summarizeService.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const q = String(req.query.q || "");


  try {
    // 1️⃣ Perform unified search
    const { unifiedSearch } = await import("../shared/services/unifiedSearch.js");

    const results = await unifiedSearch(q);
    console.log("preSSR Import");
    const {summarizeSearchResults} = await import("../shared/services/summarizeService.js");
    const summary = await summarizeSearchResults(q, results);
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