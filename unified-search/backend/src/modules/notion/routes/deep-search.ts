import express from "express";
import { deepSearchNotion } from "../services/deepNotionService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const q = String(req.query.q || "");
  const notionToken = process.env.NOTION_TOKEN!;

  try {
    const data = await deepSearchNotion(q, notionToken);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;