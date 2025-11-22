import Database from "better-sqlite3";

const db = new Database("notion.db"); // persisted between launches
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
  return stmt.all(query, query);
};

export default db;