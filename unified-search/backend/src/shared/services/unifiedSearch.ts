import { searchSlack } from "../../modules/slack/services/slackSearch.js";
import { searchLocal } from "../../local/indexCache.js";
import { getAll } from "../../local/indexCache.js";
import { normalizeResults, NormalizedRecord } from "../utils/normalizeResults.js";

// Generic type for a result from *any* service
export interface RawResult {
  source?: string;
  title?: string;
  content?: string;
  metadata?: { author?: string; date?: string };
  url?: string;
  thread?: { text: string; author?: string; date?: string }[];
  author?: string;
  date?: string;
}

export async function unifiedSearch(
  query: string
): Promise<NormalizedRecord[]> {
  let slackRaw: RawResult[] = [];
  let localRaw: RawResult[] = [];

  try {
    [slackRaw, localRaw] = await Promise.all([
      (searchSlack(query) as unknown as Promise<RawResult[]>),
      Promise.resolve(searchLocal(query)),
    ]);
  } catch (err) {
    console.error("Unified search failed:", err);
  }


  const taggedSlack = (slackRaw ?? []).map((item) => ({
    ...item,
    source: "slack",
  }));

  const taggedLocal = (localRaw ?? []).map((item) => ({
    ...item,
    source: "notion",
  }));

  const rawResults = [...taggedSlack, ...taggedLocal];
  const normalized = normalizeResults(rawResults);

  normalized.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

//   console.log("Normalized results:", normalized);

  return normalized;
}