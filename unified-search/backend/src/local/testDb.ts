import Database from "better-sqlite3";

const db = new Database("notion.db");

const rows = db.prepare("SELECT id, title, LENGTH(content) AS textLength FROM pages LIMIT 5").all();
console.log("Sample pages:", rows);