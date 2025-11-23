import "./config/env.js";
import express from "express";
import cors from "cors";
import searchRouter from "./routes/search.js";
import summarize from "./routes/summarize.js";
import cacheRouter from "./routes/cache.js";
import { buildOrUpdateCache } from "./modules/notion/utils/nocacheSync.js";


// create app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// simple test route
app.use("/api/cache", cacheRouter);
app.use("/api/search", searchRouter);






app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

try {
    await buildOrUpdateCache();
} catch (error) {
    console.error("Error building cache:", error);
}