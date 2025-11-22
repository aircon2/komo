// src/index.ts
import express from "express";
import cors from "cors";

// create app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// simple test route
app.get("/api/greet", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// example search route
function example(query: string) {
  const results = "You searched for: " + query;
  return results;
}

app.get("/api/search", (req, res) => {
  const qParam = req.query.q;
  const q = typeof qParam === "string" ? qParam : "";
  const results = example(q);
  res.json({ results });
  console.log(results);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});