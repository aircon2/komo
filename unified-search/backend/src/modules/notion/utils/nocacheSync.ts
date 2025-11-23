import { Client } from "@notionhq/client";
import db, { upsertPage } from "../../../local/indexCache.js";
import { getAllBlocks } from "../services/deepNotionService.js"; 
import { extractBlockText } from "../services/deepNotionService.js";

const notion = new Client({ auth: process.env.NOTION_TOKEN! });

export const buildOrUpdateCache = async () => {
  console.log("🚀 Loading cached pages (quick start)...");

  // 1️⃣ Load current cache count
  
  const currentPagesStmt = db.prepare("SELECT COUNT(*) AS n FROM pages");
  const result = currentPagesStmt.get() as { n: number } | undefined;
  const currentPages = result?.n ?? 0;
  console.log(`📗 Cached pages: ${currentPages}`);
  console.log(`📂 Cached pages: ${currentPages || 0}`);

  // 2️⃣ Pull latest list from Notion (just meta)
  const notionPages = await notion.search({ query: "", page_size: 50 });
  console.log(`📡 Found ${notionPages.results.length} pages on Notion.`);

  // 3️⃣ Iterate and check freshness
  for (const item of notionPages.results) {
    if (item.object !== "page") continue;

    const page: any = item;
    const titleProp = Object.values(page.properties || {}).find(
      (p: any) => p.type === "title"
    ) as any;
    const title = titleProp?.title?.[0]?.plain_text || "Untitled";

    const blocks = await getAllBlocks(notion, page.id);
    const text = blocks.map(extractBlockText).join(" ");

    upsertPage({
      id: page.id,
      title,
      content: text,
      url: page.url,
      lastEditedTime: page.last_edited_time,
    });
  }

  console.log("✅ Cache updated with latest data.");
};