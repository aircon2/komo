import dotenv from "dotenv";
import path from "path";

// absolute resolve based on working directory
const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

console.log("🟢 Dotenv attempted to load:", envPath);
console.log("🟢 NOTION_TOKEN snippet:", process.env.NOTION_TOKEN?.slice(0, 10));

export const config = {
  notionToken: process.env.NOTION_TOKEN,
  notionClientId: process.env.NOTION_CLIENT_ID,
  notionClientSecret: process.env.NOTION_CLIENT_SECRET,
  geminiApiKey: process.env.GEMINI_API_KEY!,
  port: process.env.PORT || 4000,
  slackToken: process.env.SLACK_ACCESS_TOKEN!,
};