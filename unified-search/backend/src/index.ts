import express from "express";
import dotenv from "dotenv";
import searchRouter from "./routes/search.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/search", searchRouter);

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});