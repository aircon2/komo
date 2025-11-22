import "./config/env.js";          
import express from "express";
import notionAuth from "./modules/notion/routes/auth.js";
import notionSearch from "./modules/notion/routes/search.js";
import slackAuth from "./modules/slack/routes/auth.js";
import slackSearch from "./modules/slack/routes/search.js";
import notionDeepSearch from "./modules/notion/routes/deep-search.js"; // 👈 add this line


const app = express();

app.use("/notion/auth", notionAuth);
app.use("/notion/search", notionSearch);
app.use("/slack/auth", slackAuth);
app.use("/slack/search", slackSearch);
app.use("/notion/deep-search", notionDeepSearch);

app.listen(3000, () =>
  console.log("✨ Server running on http://localhost:3000")
);