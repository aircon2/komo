import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  res.json({ message: "Search endpoint working!" });
});

export default router;