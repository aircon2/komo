// backend/index.js (Express example)
import express from "express";
import cors from "cors";
import { searchLocal } from "../local/indexCache.ts";
const app = express();

app.use(cors());

function example(query: string) {
    const results = "You searched for: " + query;
    return results;
}

app.get("/api/search", (req, res) => {
    const qParam = req.query.q;
    const q = typeof qParam === "string" ? qParam : "";
    const results = example(q);
    res.json(results);
});

app.listen(3000, () => console.log("Backend running on port 5000"));