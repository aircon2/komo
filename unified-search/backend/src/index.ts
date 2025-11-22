// src/index.ts
import express from "express";
import cors from "cors";
import searchRouter from "./routes/search.js";
import summarize from "./routes/summarize.js";

// create app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// simple test route
app.use("/api/search", searchRouter);
app.use("/api/summarize", summarize);





app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});