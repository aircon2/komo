import express from "express";
import { buildOrUpdateCache } from "../modules/notion/utils/nocacheSync.js";
import { clearAllPages } from "../local/indexCache.js";

const router = express.Router();

router.post("/build", async (req, res) => {
  try {
    await buildOrUpdateCache();
    res.json({ message: "Cache built successfully" });
  } catch (error: any) {
    console.error("Cache build error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/clear", async (req, res) => {
  try {
    const count = clearAllPages();
    res.json({ message: `Cache cleared successfully. Deleted ${count} pages.` });
  } catch (error: any) {
    console.error("Cache clear error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;