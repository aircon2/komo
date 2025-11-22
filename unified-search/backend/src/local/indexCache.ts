import Database from "better-sqlite3";

const db = new Database("notion.db"); // persisted between launches
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS pages (
  id TEXT PRIMARY KEY,
  title TEXT,
  content TEXT,
  url TEXT,
  lastEditedTime TEXT,
  blocks TEXT
);
`);

// Migration: Add blocks column if it doesn't exist
try {
  db.exec(`ALTER TABLE pages ADD COLUMN blocks TEXT;`);
} catch (e: any) {
  // Column already exists, ignore error
  if (!e.message?.includes("duplicate column name")) {
    console.warn("Migration warning:", e.message);
  }
}

export const upsertPage = (p: {
  id: string;
  title: string;
  content: string;
  url: string;
  lastEditedTime: string;
  blocks?: string; // JSON string of blocks with type and text
}) => {
  const stmt = db.prepare(`
    INSERT INTO pages (id, title, content, url, lastEditedTime, blocks)
    VALUES (@id, @title, @content, @url, @lastEditedTime, @blocks)
    ON CONFLICT(id) DO UPDATE SET
      title=@title,
      content=@content,
      url=@url,
      lastEditedTime=@lastEditedTime,
      blocks=@blocks;
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

/**
 * Extract relevant snippets from blocks containing the keyword
 * Returns only the matching block/group content, not the entire page
 */
export const searchLocalWithSnippets = (query: string) => {
  const lowerQuery = query.toLowerCase();
  const stmt = db.prepare(`
    SELECT * FROM pages
     WHERE title LIKE '%' || ? || '%'
        OR content LIKE '%' || ? || '%'
     ORDER BY lastEditedTime DESC;
  `);
  const results = stmt.all(query, query) as any[];
  
  return results.map((row) => {
    // If title matches, return the page with title
    if (row.title?.toLowerCase().includes(lowerQuery)) {
      return {
        ...row,
        content: row.title, // For title matches, just return title
        snippets: []
      };
    }
    
    // For content matches, extract relevant snippets from blocks
    let snippets: string[] = [];
    
    if (row.blocks) {
      try {
        const blocks = JSON.parse(row.blocks) as Array<{ type: string; text: string }>;
        snippets = extractRelevantSnippets(blocks, query, lowerQuery);
      } catch (e) {
        // If blocks JSON is invalid, fall back to simple text extraction
        snippets = extractSnippetsFromText(row.content, query, lowerQuery);
      }
    } else {
      // Fallback: extract snippets from plain text content
      snippets = extractSnippetsFromText(row.content, query, lowerQuery);
    }
    
    return {
      ...row,
      content: snippets.join('\n\n'), // Join multiple snippets
      snippets
    };
  });
};

/**
 * Extract relevant snippets from structured blocks
 */
function extractRelevantSnippets(
  blocks: Array<{ type: string; text: string }>,
  query: string,
  lowerQuery: string
): string[] {
  const snippets: string[] = [];
  const processedIndices = new Set<number>();
  
  for (let i = 0; i < blocks.length; i++) {
    if (processedIndices.has(i)) continue;
    
    const block = blocks[i];
    const blockText = (block.text || '').trim();
    if (!blockText) continue;
    
    const lowerBlockText = blockText.toLowerCase();
    
    if (!lowerBlockText.includes(lowerQuery)) continue;
    
    // For list items, get the entire list group
    if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
      const listGroup = extractListGroup(blocks, i, lowerQuery);
      if (listGroup.length > 0) {
        const groupText = listGroup.filter(t => t.trim()).join('\n');
        if (groupText && !snippets.includes(groupText)) {
          snippets.push(groupText);
        }
        // Mark all list items in the group as processed
        const listType = block.type;
        for (let j = i; j < blocks.length; j++) {
          if (blocks[j].type === listType && listGroup.includes(blocks[j].text)) {
            processedIndices.add(j);
          } else if (blocks[j].type !== listType) {
            break; // End of list group
          }
        }
        continue;
      }
    }
    
    // For other block types (paragraph, heading, etc.)
    // Get the complete sentence containing the keyword, or the full block if it's short
    let snippet: string;
    if (blockText.length <= 200) {
      // Short block: return the whole thing
      snippet = blockText;
    } else {
      // Long block: extract the sentence with the keyword
      snippet = extractCompleteSentence(blockText, query);
      // If sentence extraction failed, use a context window around the keyword
      if (!snippet || snippet.length < query.length) {
        snippet = extractContextWindow(blockText, query, lowerQuery);
      }
    }
    
    if (snippet && snippet.trim() && !snippets.includes(snippet)) {
      snippets.push(snippet.trim());
    }
    processedIndices.add(i);
  }
  
  return snippets;
}

/**
 * Extract complete sentence containing the keyword
 */
function extractCompleteSentence(text: string, keyword: string): string {
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const keywordIndex = lowerText.indexOf(lowerKeyword);
  
  if (keywordIndex === -1) return text;
  
  // Find sentence boundaries
  let start = 0;
  let end = text.length;
  
  // Look backwards for sentence start
  for (let i = keywordIndex - 1; i >= 0; i--) {
    if (text[i] === '.' || text[i] === '!' || text[i] === '?') {
      start = i + 1;
      break;
    }
  }
  
  // Look forwards for sentence end
  for (let i = keywordIndex + keyword.length; i < text.length; i++) {
    if (text[i] === '.' || text[i] === '!' || text[i] === '?') {
      end = i + 1;
      break;
    }
  }
  
  return text.substring(start, end).trim();
}

/**
 * Extract a group of consecutive list items of the same type
 */
function extractListGroup(
  blocks: Array<{ type: string; text: string }>,
  startIndex: number,
  lowerQuery: string
): string[] {
  const group: string[] = [];
  const listType = blocks[startIndex].type;
  
  // Go backwards to find the start of the list group
  let groupStart = startIndex;
  for (let i = startIndex - 1; i >= 0; i--) {
    if (blocks[i].type === listType) {
      groupStart = i;
    } else {
      break;
    }
  }
  
  // Go forwards to collect all items in the group
  for (let i = groupStart; i < blocks.length; i++) {
    if (blocks[i].type === listType) {
      const text = blocks[i].text?.trim();
      if (text) {
        group.push(text);
      }
    } else {
      break;
    }
  }
  
  return group;
}

/**
 * Extract a context window around the keyword (fallback when sentence extraction fails)
 */
function extractContextWindow(
  text: string,
  query: string,
  lowerQuery: string
): string {
  const lowerText = text.toLowerCase();
  const keywordIndex = lowerText.indexOf(lowerQuery);
  
  if (keywordIndex === -1) return text;
  
  // Extract 150 characters before and after the keyword
  const contextStart = Math.max(0, keywordIndex - 150);
  const contextEnd = Math.min(text.length, keywordIndex + query.length + 150);
  
  let snippet = text.substring(contextStart, contextEnd);
  
  // Try to start/end at word boundaries
  if (contextStart > 0) {
    const firstSpace = snippet.indexOf(' ');
    if (firstSpace > 0 && firstSpace < 50) {
      snippet = snippet.substring(firstSpace + 1);
    }
  }
  
  if (contextEnd < text.length) {
    const lastSpace = snippet.lastIndexOf(' ');
    if (lastSpace > snippet.length - 50 && lastSpace > 0) {
      snippet = snippet.substring(0, lastSpace);
    }
  }
  
  return snippet.trim();
}

/**
 * Fallback: Extract snippets from plain text when blocks aren't available
 */
function extractSnippetsFromText(
  content: string,
  query: string,
  lowerQuery: string
): string[] {
  const snippets: string[] = [];
  const lowerContent = content.toLowerCase();
  
  // Find all occurrences of the keyword
  let searchIndex = 0;
  while ((searchIndex = lowerContent.indexOf(lowerQuery, searchIndex)) !== -1) {
    // Extract sentence around the keyword
    const sentence = extractCompleteSentence(content.substring(Math.max(0, searchIndex - 200)), query);
    if (sentence && !snippets.includes(sentence)) {
      snippets.push(sentence);
    }
    searchIndex += query.length;
    
    // Limit to 5 snippets per page
    if (snippets.length >= 5) break;
  }
  
  return snippets;
}

export default db;