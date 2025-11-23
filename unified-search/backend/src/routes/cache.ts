import express from "express";
import { buildOrUpdateCache } from "../modules/notion/utils/nocacheSync.js";

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

export default router;