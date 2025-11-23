import { useState, useEffect } from "react";
import { SearchResultItem } from "./SearchResultItem";
import { NotionPopup } from "./NotionPopup";
import { CornerDownLeft, ArrowLeft } from "lucide-react";
import sadcloud from "../assets/sadcloud.png";
import { extractTextSnippet, highlightText } from "../utils/textSnippet";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface DashboardProps {
  searchQuery: string;
  activeApps: Record<string, boolean>;
  onBack: () => void;
  onSearchChange: (query: string) => void;
}

interface SearchResult {
  id: string;
  type: "slack" | "notion";
  message: string;
  date: string;
  fullText?: string; // Full text for Notion pages
  metadata?: {
    author?: string;
    channel?: string;
    title?: string; // Page title for Notion
  };
}

interface BackendSearchResult {
  source: string;
  title: string;
  text: string;
  author?: string;
  date?: string;
  link?: string;
}

interface SummaryItem {
  topic: string;
  summary: string;
  references?: string[];
}

interface SummaryResponse {
  query: string;
  summary: {
    summary: SummaryItem[];
  } | SummaryItem[] | string;
}

function ReturnKeyIcon() {
  return (
    <div className="relative size-[24.02px] flex items-center justify-center">
      <div className="border border-[#8E8E93] rounded px-1 py-0.5 bg-white shadow-sm">
        <CornerDownLeft className="size-3 text-[#3D3D3D]" />
      </div>
    </div>
  );
}

export function Dashboard({ searchQuery, activeApps, onBack, onSearchChange }: DashboardProps) {
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [showNotionPopup, setShowNotionPopup] = useState(false);
  const [selectedNotionData, setSelectedNotionData] = useState<{ title: string; text: string } | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch search results and summary from backend - searches on every keystroke
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSummary("");
      setLoading(false);
      return;
    }

    // AbortController to cancel previous requests when query changes
    const abortController = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("🔍 Fetching from:", `${API_BASE_URL}/api/search?q=${encodeURIComponent(searchQuery)}`);
        // Fetch search results with abort signal
        const searchResponse = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(searchQuery)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: abortController.signal,
        });
        console.log("📡 Search response status:", searchResponse.status);
        if (!searchResponse.ok) {
          const errorText = await searchResponse.text();
          console.error("❌ Search failed:", errorText);
          throw new Error(`Search failed: ${searchResponse.statusText}`);
        }
        const backendResults: BackendSearchResult[] = await searchResponse.json();
        console.log("✅ Search results received:", backendResults.length, "items");

        // Transform backend results to frontend format
        const transformedResults: SearchResult[] = backendResults
          .filter((result) => {
            // Filter by active apps
            if (result.source === "slack" && !activeApps.Slack) return false;
            if (result.source === "notion" && !activeApps.Notion) return false;
            return true;
          })
          .map((result, index) => {
            // Extract snippet around search query (not full text)
            const text = result.text || "";
            const highlightedText = extractTextSnippet(text, searchQuery, 100);

            // Format date
            let dateStr = "";
            if (result.date) {
              try {
                const date = new Date(result.date);
                if (!isNaN(date.getTime())) {
                  dateStr = `${date.getDate()}/${date.getMonth() + 1}`;
                }
              } catch (e) {
                // Invalid date, leave empty
              }
            }

            // Generate unique ID: combine source, link, date, text hash, and index to ensure uniqueness
            const linkPart = (result.link || result.title || 'unknown').substring(0, 50);
            const textHash = text.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '');
            const uniqueId = `${result.source}-${linkPart}-${textHash}-${result.date || index}-${index}`;

            return {
              id: uniqueId,
              type: result.source as "slack" | "notion",
              message: highlightedText || "No content",
              date: dateStr,
              fullText: result.source === "notion" ? result.text : undefined, // Store full text for Notion
              metadata: {
                author: result.author,
                channel: result.source === "slack" ? result.title : undefined,
                title: result.source === "notion" ? result.title : undefined, // Page title for Notion
              },
            };
          });

        setSearchResults(transformedResults);

        // Fetch summary with abort signal - pass active apps
        const activeSources = [];
        if (activeApps.Slack) activeSources.push("slack");
        if (activeApps.Notion) activeSources.push("notion");
        const sourcesParam = activeSources.join(",") || "slack,notion"; // Default to both if none selected
        
        console.log("📝 Fetching summary from:", `${API_BASE_URL}/api/summarize?q=${encodeURIComponent(searchQuery)}&sources=${sourcesParam}`);
        const summaryResponse = await fetch(`${API_BASE_URL}/api/summarize?q=${encodeURIComponent(searchQuery)}&sources=${sourcesParam}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: abortController.signal,
        });
        console.log("📡 Summary response status:", summaryResponse.status);
        if (!summaryResponse.ok) {
          const errorText = await summaryResponse.text();
          console.error("❌ Summary failed:", errorText);
          throw new Error(`Summary failed: ${summaryResponse.statusText}`);
        }
        const summaryData: SummaryResponse = await summaryResponse.json();
        console.log("✅ Summary received:", summaryData);
        
        // Handle different summary response formats
        let summaryText = "";
        try {
          if (summaryData.summary) {
            let summaryArray: SummaryItem[] = [];
            
            // The API returns: { query: "...", summary: { summary: [...] } }
            if (typeof summaryData.summary === "object" && !Array.isArray(summaryData.summary)) {
              // Nested object format: { summary: { summary: [...] } }
              const nested = summaryData.summary as any;
              if (Array.isArray(nested.summary)) {
                summaryArray = nested.summary;
              } else if (Array.isArray(nested)) {
                summaryArray = nested;
              }
            } else if (Array.isArray(summaryData.summary)) {
              // Direct array format
              summaryArray = summaryData.summary;
            } else if (typeof summaryData.summary === "string") {
              // Fallback: if it's already a string
              summaryText = summaryData.summary;
            }
            
            if (Array.isArray(summaryArray) && summaryArray.length > 0) {
              // Format the summary array into readable HTML
              summaryText = summaryArray.map((item: SummaryItem) => {
                const topic = (item.topic || "Topic").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                const summary = (item.summary || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                return `<p class="font-['Hanken_Grotesk:Bold',sans-serif] font-bold mb-2">${topic}</p><p class="mb-3">${summary}</p>`;
              }).join("");
            }
          }
        } catch (summaryError) {
          console.error("Error parsing summary:", summaryError);
          summaryText = "Summary format error. Please try again.";
        }
        
        setSummary(summaryText);
      } catch (err: any) {
        // Don't show error if request was aborted (user typed new character)
        if (err.name === 'AbortError') {
          console.log("Request aborted (new search started)");
          return;
        }
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data");
        setSearchResults([]);
        setSummary("");
      } finally {
        setLoading(false);
      }
    };

    // Search immediately on every keystroke (no debounce for real-time search)
    fetchData();

    // Cleanup: abort any pending requests when query changes
    return () => {
      abortController.abort();
    };
  }, [searchQuery, activeApps]);

  const filteredResults = searchResults;

  // Auto-select first result to always show summary
  const effectiveSelectedResult = selectedResult || (filteredResults.length > 0 ? filteredResults[0].id : null);

  const handleResultClick = (result: SearchResult) => {
    setSelectedResult(result.id);
    if (result.type === "notion" && result.metadata?.title && result.fullText) {
      setSelectedNotionData({
        title: result.metadata.title,
        text: result.fullText,
      });
      setShowNotionPopup(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Re-render/refresh the dashboard with current search
      setSelectedResult(null); // Reset selection to show first result
    }
  };

  return (
    <div className="bg-[#faf9f6] relative size-full min-h-screen overflow-hidden" data-name="kumo portal - dashboard">
      {/* Back to home button */}
      <button
        onClick={onBack}
        className="absolute left-[60px] top-[20px] flex items-center gap-2 text-[#3d3d3d] hover:text-[#051b78] transition-colors group"
      >
        <ArrowLeft className="size-5 group-hover:translate-x-[-2px] transition-transform" />
        <span className="font-['Hanken_Grotesk:Regular',sans-serif] text-[15px]">
          back to home
        </span>
      </button>

      {/* Top prompt area */}
      <div className="absolute content-stretch flex items-center justify-between left-[60px] top-[50px] right-[60px]">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="what are you looking for?"
          className="flex-1 bg-transparent border-none outline-none leading-[normal] not-italic text-[32px] text-black placeholder:text-[rgba(60,60,67,0.6)] cursor-text"
          onKeyDown={handleKeyDown}
        />
        <div className="content-stretch flex gap-[3px] items-center justify-end">
          <p className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal leading-[normal] text-[#3d3d3d] text-[17.157px] text-nowrap whitespace-pre">enter </p>
          <ReturnKeyIcon />
        </div>
      </div>

      {/* Line under prompt */}
      <div className="absolute h-0 left-[60px] top-[105px] right-[60px]">
        <div className="absolute inset-[-4px_0_-8px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1135 12">
            <g filter="url(#filter0_d_dashboard_line)" id="line">
              <path d="M6 4H1129" stroke="var(--stroke-0, #051B78)" strokeLinecap="round" strokeWidth="4" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="12" id="filter0_d_dashboard_line" width="1135" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="2" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_1743" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_1743" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>

      {/* Main container with border */}
      <div className="absolute left-[60px] rounded-[20px] top-[130px] right-[60px] bottom-[60px] max-h-[calc(100vh-190px)]">
        <div aria-hidden="true" className="absolute border-4 border-[#051b78] border-solid inset-0 pointer-events-none rounded-[20px]" />

        {/* Vertical divider */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[4px] -ml-[2px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 636">
            <line stroke="var(--stroke-0, #051B78)" strokeWidth="4" x1="2" x2="2" y1="0" y2="636" />
          </svg>
        </div>

        {/* Left side - Search Results */}
        <div className="absolute left-0 top-0 bottom-0 w-1/2 overflow-hidden">
          <p className="absolute leading-[normal] left-[30px] not-italic text-[28px] text-black text-nowrap top-[30px] whitespace-pre">
            search results
          </p>
          <div className="absolute h-0 left-[31px] top-[70px] w-[145px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-2px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 165 2">
                <line stroke="var(--stroke-0, #051B78)" strokeWidth="2" x2="150" y1="1" y2="1" />
              </svg>
            </div>
          </div>

          {/* Search results list - no horizontal scroll, with proper spacing */}
          <div className="absolute left-[38px] top-[90px] right-[30px] bottom-[20px] overflow-y-auto overflow-x-hidden">
            {loading ? (
              <div className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal text-[13px] text-[#8e8e93]">
                Loading results...
              </div>
            ) : error ? (
              <div className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal text-[13px] text-red-500">
                Error: {error}
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal text-[13px] text-[#8e8e93]">
                No results found. Try a different search query.
              </div>
            ) : (
              <div className="flex flex-col gap-[10px]">
                {filteredResults.map(result => (
                  <SearchResultItem
                    key={result.id}
                    type={result.type}
                    message={result.message}
                    date={result.date}
                    isSelected={effectiveSelectedResult === result.id}
                    onClick={() => handleResultClick(result)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side - Summary & Information (always shown) */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
          {/* Summary section */}
          <p className="absolute leading-[normal] left-[30px] not-italic text-[28px] text-black text-nowrap top-[30px] whitespace-pre">
            summary
          </p>
          <div className="absolute h-0 left-[30px] top-[70px] w-[105px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-2px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 125 2">
                <line stroke="var(--stroke-0, #051B78)" strokeWidth="2" x2="120" y1="1" y2="1" />
              </svg>
            </div>
          </div>

          {/* Summary content */}
          <div className="absolute left-[30px] top-[90px] right-[30px] max-h-[38%] overflow-y-auto">
            {loading ? (
              <div className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal text-[13px] text-[#8e8e93]">
                Loading summary...
              </div>
            ) : error ? (
              <div className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal text-[13px] text-red-500">
                Error: {error}
              </div>
            ) : summary ? (
              <div
                className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal text-[13px] text-black leading-[1.5]"
                dangerouslySetInnerHTML={{ __html: summary }}
              />
            ) : (
              <div className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal text-[13px] text-[#8e8e93]">
                No summary available. Try searching for something.
              </div>
            )}
          </div>

          {/* Horizontal divider */}
          <div className="absolute h-0 left-[5px] top-[58%] right-[5px]">
            <div className="absolute bottom-[-2px] left-0 right-0 top-[-2px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 558 4">
                <path d="M0 2H558" stroke="var(--stroke-0, #051B78)" strokeWidth="4" />
              </svg>
            </div>
          </div>

          {/* Information section */}
          <p className="absolute leading-[normal] left-[30px] not-italic text-[28px] text-black text-nowrap top-[calc(58%+25px)] whitespace-pre">
            information
          </p>
          <div className="absolute h-0 left-[30px] top-[calc(58%+65px)] w-[130px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-2px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 150 2">
                <line stroke="var(--stroke-0, #051B78)" strokeWidth="2" x2="140" y1="1" y2="1" />
              </svg>
            </div>
          </div>

          {/* Information content */}
          <div className="absolute left-[30px] top-[calc(58%+85px)] right-[30px] bottom-[20px]">
            {effectiveSelectedResult ? (() => {
              const result = filteredResults.find(r => r.id === effectiveSelectedResult);
              if (!result) return null;
              
              return (
                <div className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal text-[13px] text-[#8e8e93] leading-[1.8] space-y-1">
                  {result.metadata?.channel && (
                    <div className="flex justify-between">
                      <span>channel name</span>
                      <span className="text-black">#{result.metadata.channel}</span>
                    </div>
                  )}
                  {result.metadata?.title && (
                    <div className="flex justify-between">
                      <span>page title</span>
                      <span className="text-black">{result.metadata.title}</span>
                    </div>
                  )}
                  {result.metadata?.author && (
                    <div className="flex justify-between">
                      <span>from</span>
                      <span className="text-black">{result.metadata.author}</span>
                    </div>
                  )}
                  {result.date && (
                    <div className="flex justify-between">
                      <span>posted</span>
                      <span className="text-black">{result.date}</span>
                    </div>
                  )}
                </div>
              );
            })() : (
            <div className="flex flex-col items-center justify-center h-full max-h-[180px]">
              <p className="font-['Hanken_Grotesk:Regular',sans-serif] text-[15px] text-[#8e8e93] mb-3">
                this space is all clear!
              </p>
              <img src={sadcloud.src} alt="Sad Cloud" className="w-[80px] h-[80px] object-contain mb-3" />
              <p className="font-['Hanken_Grotesk:Regular',sans-serif] text-[15px] text-[#8e8e93]">
                try selecting a search result to explore.
              </p>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Notion Popup */}
      {showNotionPopup && selectedNotionData && (
        <NotionPopup
          title={selectedNotionData.title}
          content={selectedNotionData.text}
          searchQuery={searchQuery}
          onClose={() => {
            setShowNotionPopup(false);
            setSelectedNotionData(null);
          }}
        />
      )}
    </div>
  );
}