import "dotenv/config";
import express from "express";
import cors from "cors";
import notionAuth from "./modules/notion/routes/auth.js";
import notionSearch from "./modules/notion/routes/search.js";
import slackAuth from "./modules/slack/routes/auth.js";
import slackSearch from "./modules/slack/routes/search.js";

const app = express();
app.use(cors());

app.use("/notion/auth", notionAuth);
app.use("/notion/search", notionSearch);
app.use("/slack/auth", slackAuth);
app.use("/slack/search", slackSearch);

app.listen(4000, () =>
  console.log("✨ Server running on http://localhost:4000")
);