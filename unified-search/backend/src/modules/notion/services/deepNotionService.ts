import { Client } from "@notionhq/client";

/**
 * 🔍 Deep Notion search
 * - Matches query in titles AND inside page content blocks
 */
export const deepSearchNotion = async (
  query: string,
  notionToken: string
) => {
  const notion = new Client({ auth: notionToken });
  const lowerQuery = query.toLowerCase();

  // Get all pages the integration can access
  const searchResponse = await notion.search({
    query: "",
    page_size: 25,
    sort: { direction: "descending", timestamp: "last_edited_time" },
  });

  const matchingPages: any[] = [];

  for (const raw of searchResponse.results) {
    if (raw.object !== "page") continue;
    const page = raw as any; // 👈 this line fixes all the TypeScript errors

    // --- Title extraction ---
    let title = "Untitled";
    const props = page.properties || {};
    const titleProp = Object.values(props).find(
      (p: any) => p.type === "title"
    ) as any;
    if (titleProp?.title?.[0]?.plain_text)
      title = titleProp.title[0].plain_text;

    const titleMatch = title.toLowerCase().includes(lowerQuery);

    // --- Check content blocks ---
    let contentMatch = false;
    if (!titleMatch) {
      const blocks = await getAllBlocks(notion, page.id);
      for (const block of blocks) {
        const text = extractBlockText(block);
        if (text.toLowerCase().includes(lowerQuery)) {
          contentMatch = true;
          break;
        }
      }
    }

    if (titleMatch || contentMatch) {
      matchingPages.push({
        source: "notion",
        id: page.id,
        title,
        url: page.url,
        icon:
          page.icon?.emoji ||
          page.icon?.external?.url ||
          page.icon?.file?.url ||
          "📄",
        lastEditedTime: page.last_edited_time,
        createdTime: page.created_time,
      });
    }
  }

  return { total: matchingPages.length, results: matchingPages };
};

// ---------- Helpers ----------
export async function getAllBlocks(notion: Client, blockId: string) {
    let all: any[] = [];
    let cursor: string | null = null;
  
    do {
      try {
        const res = await notion.blocks.children.list({
          block_id: blockId,
          start_cursor: cursor ?? undefined,
          page_size: 50,
        });
        all = all.concat(res.results);
        cursor = res.next_cursor;
      } catch (err: any) {
        // 👇 filter out unsupported block errors
        if (
          err.body?.message?.includes("Block type transcription") ||
          err.message?.includes("Block type transcription")
        ) {
          console.warn(
            `Skipping unsupported block type at block ID ${blockId}`
          );
          break; // leave loop for this block instead of crashing
        }
        throw err; // rethrow other errors
      }
    } while (cursor);
  
    const nested: any[] = [];
    for (const b of all) {
      if (b.has_children) {
        try {
          nested.push(...(await getAllBlocks(notion, b.id)));
        } catch (nestedErr: any) {
          // again, silently skip transcription children
          if (
            nestedErr.body?.message?.includes("Block type transcription") ||
            nestedErr.message?.includes("Block type transcription")
          ) {
            console.warn(
              `Skipping unsupported nested block: ${b.id}`
            );
            continue;
          }
          throw nestedErr;
        }
      }
    }
  
    return [...all, ...nested];
  }

export function extractBlockText(block: any): string {
  const type = block.type;
  const content = block[type]?.rich_text ?? [];
  return content.map((t: any) => t?.plain_text ?? "").join(" ");
}