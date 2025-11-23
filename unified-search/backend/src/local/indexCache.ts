import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the backend root directory (go up from src/local to backend root)
const backendRoot = path.resolve(__dirname, "../..");
const dbPath = path.join(backendRoot, "notion.db");

const db = new Database(dbPath); // Use absolute path
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS pages (
  id TEXT PRIMARY KEY,
  title TEXT,
  content TEXT,
  url TEXT,
  lastEditedTime TEXT
);
`);

export const upsertPage = (p: {
  id: string;
  title: string;
  content: string;
  url: string;
  lastEditedTime: string;
}) => {
  const stmt = db.prepare(`
    INSERT INTO pages (id, title, content, url, lastEditedTime)
    VALUES (@id, @title, @content, @url, @lastEditedTime)
    ON CONFLICT(id) DO UPDATE SET
      title=@title,
      content=@content,
      url=@url,
      lastEditedTime=@lastEditedTime;
  `);
  stmt.run(p);
};

export const getAll = () => db.prepare("SELECT * FROM pages").all();

export const searchLocal = (query: string) => {
    const stmt = db.prepare(`
      SELECT * FROM pages
       WHERE title LIKE '%' || ? || '%'
          OR content LIKE '%' || ? || '%'
       ORDER BY lastEditedTime DESC;
    `);
    const results = stmt.all(query, query);
    
    // Transform to match RawResult interface expected by unifiedSearch
    return results.map((row: any) => ({
      source: "notion",
      title: row.title || "Untitled",
      content: row.content || "",
      url: row.url,
      date: row.lastEditedTime,
      metadata: {
        date: row.lastEditedTime
      }
    }));
  };

export default db;