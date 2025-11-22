// backend/src/routes/auth.ts
import express from "express";
import { setNotionOAuthToken } from "../utils/tokenStore.js";

const router = express.Router();

// OAuth initiation - redirects to Notion
router.get("/notion", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.NOTION_CLIENT_ID!,
    redirect_uri: "http://localhost:4000/notion/auth/callback",
    response_type: "code",
    owner: "user",
  });

  res.redirect(`https://api.notion.com/v1/oauth/authorize?${params.toString()}`);
});

// OAuth callback - exchanges code for access token
router.get("/callback", async (req, res) => {
  const code = req.query.code as string;
  const error = req.query.error as string | undefined;

  if (error) {
    return res.status(400).json({ error: `OAuth error: ${error}` });
  }

  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  try {
    // Exchange code for access token using Basic Auth
    const basicAuth = Buffer.from(
      `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
    ).toString("base64");

    const tokenResponse = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: "http://localhost:4000/notion/auth/callback",
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      return res.status(500).json({ error: "Failed to exchange code for token" });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Store the OAuth token for use in searches
    setNotionOAuthToken(accessToken);

    // Return success message
    res.json({
      success: true,
      message: "Notion connected successfully! You can now use the search feature.",
    });
  } catch (error: any) {
    console.error("OAuth callback error:", error);
    res.status(500).json({ error: error.message || "Failed to complete OAuth flow" });
  }
});

export default router;