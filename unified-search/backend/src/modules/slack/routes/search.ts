import express, { Router } from "express";
import { searchSlack } from "../services/slackSearch.js";

const router: Router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = req.query.q as string;
    const authHeader = req.headers.authorization;
    
    // Prefer token from header, fallback to env var (if any)
    let token = authHeader?.startsWith("Bearer ") 
      ? authHeader.split(" ")[1] 
      : process.env.SLACK_ACCESS_TOKEN;

    if (!query) {
      res.status(400).json({ error: "Missing search query" });
      return;
    }

    if (!token) {
      res.status(401).json({ error: "Missing Slack access token" });
      return;
    }

    // Optional: Verify token if it's a new one (caching verification would be better for prod)
    // For now, we just try to use it, if it fails, the service throws.
    // If the user explicitly requested verification logic:
    // const isValid = await slackService.verifyToken(token);
    // if (!isValid) { return res.status(401).json({ error: "Invalid token" }); }

    const results = await searchSlack(query);
    res.json(results);
  } catch (error) {
    console.error("Search route error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
