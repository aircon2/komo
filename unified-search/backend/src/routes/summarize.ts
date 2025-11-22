// backend/src/routes/summarize.ts
import express from "express";
import { slackService } from "../modules/slack/services/slackService.js";
import { notionService } from "../modules/notion/services/notionService.js";
import { normalizeResults } from "../shared/utils/normalizeResults.js";
import { summarizeSearchResults } from "../services/summarizerService";

const router = express.Router();

router.get("/", async (req, res) => {
  const q = String(req.query.q || "");
  const sources = String(req.query.sources || "slack,notion").split(",");

  try {
    const rawResults: any[] = [];

    if (sources.includes("slack")) rawResults.push(...(await searchSlack(q)));
    if (sources.includes("notion")) rawResults.push(...(await searchNotion(q)));

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