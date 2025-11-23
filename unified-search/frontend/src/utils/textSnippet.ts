/**
 * Extracts a snippet of text around the search query match
 * @param text - Full text content
 * @param query - Search query
 * @param snippetLength - Length of snippet on each side of match (default: 100)
 * @returns Snippet with highlighted query
 */
export function extractTextSnippet(
  text: string,
  query: string,
  snippetLength: number = 100
): string {
  if (!text || !query) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  // Find the first match
  const matchIndex = lowerText.indexOf(lowerQuery);
  
  if (matchIndex === -1) {
    // No match found, return first snippetLength characters
    return text.substring(0, snippetLength * 2) + (text.length > snippetLength * 2 ? "..." : "");
  }

  // Calculate snippet boundaries
  const start = Math.max(0, matchIndex - snippetLength);
  const end = Math.min(text.length, matchIndex + query.length + snippetLength);
  
  // Extract snippet
  let snippet = text.substring(start, end);
  
  // Add ellipsis if needed
  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";
  
  // Escape special regex characters in query for highlighting
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Split query into words and highlight each word separately
  // This ensures multi-word queries like "hack western" will bold both "hack" and "western"
  const words = escapedQuery.split(/\s+/).filter(w => w.length > 0);
  
  // Highlight all matching words (case-insensitive)
  // Process from longest to shortest to avoid partial matches
  const sortedWords = words.sort((a, b) => b.length - a.length);
  let highlightedSnippet = snippet;
  
  // Use a placeholder to mark already highlighted text to avoid double-highlighting
  const PLACEHOLDER = '___HIGHLIGHTED___';
  const placeholders: string[] = [];
  let placeholderIndex = 0;
  
  // First pass: replace matches with placeholders
  sortedWords.forEach(word => {
    const wordRegex = new RegExp(`(${word})`, "gi");
    highlightedSnippet = highlightedSnippet.replace(wordRegex, (match) => {
      const placeholder = `${PLACEHOLDER}${placeholderIndex}${PLACEHOLDER}`;
      // Use simpler bold styling that works reliably
      placeholders.push(`<span style="font-weight: bold;">${match}</span>`);
      placeholderIndex++;
      return placeholder;
    });
  });
  
  // Second pass: replace placeholders with actual HTML
  placeholders.forEach((html, index) => {
    highlightedSnippet = highlightedSnippet.replace(
      `${PLACEHOLDER}${index}${PLACEHOLDER}`,
      html
    );
  });
  
  return highlightedSnippet;
}

/**
 * Highlights search query words in full text (without extracting snippets)
 * @param text - Full text content
 * @param query - Search query
 * @returns Text with highlighted query words
 */
export function highlightText(text: string, query: string): string {
  if (!text || !query) return text;

  // Escape special regex characters in query for highlighting
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Split query into words and highlight each word separately
  const words = escapedQuery.split(/\s+/).filter(w => w.length > 0);

  if (words.length === 0) return text;

  // Highlight all matching words (case-insensitive)
  // Process from longest to shortest to avoid partial matches
  const sortedWords = words.sort((a, b) => b.length - a.length);
  let highlightedText = text;

  // Use a placeholder to mark already highlighted text to avoid double-highlighting
  const PLACEHOLDER_PREFIX = '___HIGHLIGHTED_';
  const PLACEHOLDER_SUFFIX = '___';
  const placeholders: string[] = [];
  let placeholderIndex = 0;

  // First pass: replace matches with placeholders
  sortedWords.forEach(word => {
    const wordRegex = new RegExp(`(${word})`, "gi");
    highlightedText = highlightedText.replace(wordRegex, (match) => {
      const placeholder = `${PLACEHOLDER_PREFIX}${placeholderIndex}${PLACEHOLDER_SUFFIX}`;
      // Store the HTML with inline style
      placeholders.push(`<span style="font-weight: bold;">${match}</span>`);
      placeholderIndex++;
      return placeholder;
    });
  });

  // Second pass: replace placeholders with actual HTML
  placeholders.forEach((html, index) => {
    highlightedText = highlightedText.replace(
      `${PLACEHOLDER_PREFIX}${index}${PLACEHOLDER_SUFFIX}`,
      html
    );
  });

  return highlightedText;
}

