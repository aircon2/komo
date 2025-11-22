export interface NormalizedRecord {
  source: string
  title: string
  text: string
  author?: string
  date?: string
  link?: string
}

/** Normalize heterogeneous JSON from all services */
export function normalizeResults(rawResults: any[]): NormalizedRecord[] {
  const normalized: NormalizedRecord[] = []

  for (const item of rawResults) {
    switch (item.source) {
      case "slack":
        normalized.push(...normalizeSlackItems(item))
        break
      case "notion":
        normalized.push(normalizeNotionItem(item))
        break
      default:
        normalized.push({
          source: item.source ?? "unknown",
          title: item.title ?? "Untitled",
          text: item.content ?? JSON.stringify(item),
          link: item.url,
        })
    }
  }

  return normalized
}

/** Flatten Slack threads and unify fields */
function normalizeSlackItems(slackItem: any): NormalizedRecord[] {
  const records: NormalizedRecord[] = []

  // include the main message itself
  records.push({
    source: "slack",
    title: slackItem.title ?? "#general",
    text: slackItem.content ?? "",
    author: slackItem.metadata?.author,
    date: slackItem.metadata?.date,
    link: slackItem.url,
  })

  // include threaded replies (each as individual context documents)
  if (Array.isArray(slackItem.thread)) {
    for (const reply of slackItem.thread) {
      records.push({
        source: "slack",
        title: slackItem.title ?? "#general",
        text: reply.text,
        author: reply.author,
        date: reply.date,
        link: slackItem.url,
      })
    }
  }

  return records
}

/** Example for Notion items (expand as needed) */
function normalizeNotionItem(notionItem: any): NormalizedRecord {
  return {
    source: "notion",
    title: notionItem.title ?? "Untitled",
    text: notionItem.text ?? notionItem.content ?? "",
    author: notionItem.author,
    date: notionItem.date,
    link: notionItem.url,
  }
}