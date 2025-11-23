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

export const clearAllPages = () => {
  const stmt = db.prepare("DELETE FROM pages");
  const result = stmt.run();
  console.log(`🗑️  Deleted ${result.changes} cached pages`);
  return result.changes;
};

export const searchLocal = (query: string) => {
    if (!query.trim()) {
      return [];
    }

    // Split query into words for better matching
    const words = query.trim().split(/\s+/).filter(w => w.length > 0);
    
    if (words.length === 0) {
      return [];
    }

    // Build word-based search conditions
    // Each word must appear in either title or content
    const conditions = words.map(() => `(title LIKE '%' || ? || '%' OR content LIKE '%' || ? || '%')`).join(' AND ');
    const params: string[] = [];
    words.forEach(word => {
      params.push(word, word); // One for title, one for content
    });

    const stmt = db.prepare(`
      SELECT DISTINCT * FROM pages
       WHERE ${conditions}
       ORDER BY lastEditedTime DESC
       LIMIT 50;
    `);
    
    const results = stmt.all(...params) as any[];
    console.log(`📚 Notion search (from cache): Found ${results.length} results for "${query}" - NO API CALLS`);
    
    // Deduplicate by ID (in case of any edge cases)
    const seen = new Set<string>();
    const uniqueResults = results.filter((row: any) => {
      if (seen.has(row.id)) {
        return false;
      }
      seen.add(row.id);
      return true;
    });
    
    // Transform to match RawResult interface expected by unifiedSearch
    return uniqueResults.map((row: any) => ({
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