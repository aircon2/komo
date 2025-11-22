
import express from "express";
import { slackService } from "../modules/slack/services/slackService.js";
import { searchLocal } from "../local/indexCache.ts";
import { normalizeResults } from "../shared/utils/normalizeResults.js";
import { summarizeSearchResults } from "../shared/services/summarizeService.ts";
const router = express.Router();

router.get("/", async (req, res) => {
  const q = String(req.query.q || "");
  const sources = String(req.query.sources || "slack,notion").split(",");

  try {
    const rawResults: any[] = [];

    if (sources.includes("slack")) {
      const token = process.env.SLACK_ACCESS_TOKEN;
      if (!token) {
        throw new Error("SLACK_ACCESS_TOKEN not configured");
      }
      const slackResults = await slackService.search(token, q);
      rawResults.push(...slackResults);
    }
    if (sources.includes("notion")) rawResults.push(...(await searchLocal(q)));

    // 1️⃣ Normalize all data into unified structure
    const normalized = normalizeResults(rawResults);

    // 2️⃣ Generate summary JSON via AI
    const summary = await summarizeSearchResults(q, normalized);

    // 3️⃣ Send back
    res.json({ query: q, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to summarize results" });
  }
});

export default router;