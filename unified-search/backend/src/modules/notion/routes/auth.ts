// backend/src/routes/auth.ts
import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/notion", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.NOTION_CLIENT_ID!,
    redirect_uri: "http://localhost:3000/auth/notion/callback",
    response_type: "code",
    owner: "user",
  });

  res.redirect(`https://api.notion.com/v1/oauth/authorize?${params.toString()}`);
});

export default router;