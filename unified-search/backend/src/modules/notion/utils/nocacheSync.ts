import { Client } from "@notionhq/client";
import db, { upsertPage } from "../../../local/indexCache.js";
import { getAllBlocks } from "../services/deepNotionService.js"; 
import { extractBlockText } from "../services/deepNotionService.js";

const notion = new Client({ auth: process.env.NOTION_TOKEN! });

// Track last rate limit time to avoid retrying too soon
let lastRateLimitTime: number | null = null;
const RATE_LIMIT_COOLDOWN = 5 * 60 * 1000; // 5 minutes

export const buildOrUpdateCache = async () => {
  console.log("🚀 Loading cached pages (quick start)...");

  // 1️⃣ Load current cache count
  const currentPagesStmt = db.prepare("SELECT COUNT(*) AS n FROM pages");
  const result = currentPagesStmt.get() as { n: number } | undefined;
  const currentPages = result?.n ?? 0;
  console.log(`📗 Cached pages: ${currentPages}`);

  // If we have cached pages, skip the update to avoid rate limits
  // Only update if cache is empty or explicitly requested
  if (currentPages > 0 && !process.env.NOTION_FORCE_CACHE_UPDATE) {
    console.log("✅ Using existing cache. Set NOTION_FORCE_CACHE_UPDATE=1 to force update.");
    console.log("✅ All searches use cached data - NO Notion API calls will be made.");
    return;
  }

  // Check if we were recently rate limited
  if (lastRateLimitTime && Date.now() - lastRateLimitTime < RATE_LIMIT_COOLDOWN) {
    const minutesLeft = Math.ceil((RATE_LIMIT_COOLDOWN - (Date.now() - lastRateLimitTime)) / 60000);
    console.warn(`⚠️  Skipping cache update - rate limited recently. Wait ${minutesLeft} more minutes.`);
    console.log("✅ Searches will use existing cache - NO API calls.");
    return;
  }

  try {
    // 2️⃣ Pull latest list from Notion (just meta)
    const notionPages = await notion.search({ query: "", page_size: 50 });
    console.log(`📡 Found ${notionPages.results.length} pages on Notion.`);

    // 3️⃣ Iterate and check freshness (with rate limit protection)
    let processed = 0;
    const MAX_PAGES_PER_RUN = 10; // Limit to avoid rate limits
    
    for (const item of notionPages.results.slice(0, MAX_PAGES_PER_RUN)) {
      if (item.object !== "page") continue;

      try {
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
        
        processed++;
        
        // Small delay to avoid rate limits
        if (processed < MAX_PAGES_PER_RUN) {
          await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay
        }
      } catch (pageError: any) {
        if (pageError.code === 'rate_limited') {
          lastRateLimitTime = Date.now();
          console.warn(`⚠️  Rate limited while processing page. Stopping cache update.`);
          console.log("✅ Searches will continue using existing cache - NO API calls.");
          throw pageError; // Re-throw to stop the process
        }
        console.warn(`⚠️  Error processing page ${item.id}:`, pageError.message);
        // Continue with next page
      }
    }

    console.log(`✅ Cache updated with ${processed} pages.`);
  } catch (error: any) {
    if (error.code === 'rate_limited') {
      lastRateLimitTime = Date.now();
      console.warn("⚠️  Notion API rate limited. Using existing cache data.");
      console.log("✅ All searches use cached database - NO Notion API calls will be made.");
      throw error; // Re-throw so caller can handle it
    }
    throw error;
  }
};