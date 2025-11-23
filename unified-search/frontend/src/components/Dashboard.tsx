import { useState } from "react";
import svgPaths from "../imports/svg-coysm1x50q";
import { SearchResultItem } from "./SearchResultItem";
import { EmptyState } from "./EmptyState";
import { NotionPopup } from "./NotionPopup";
import imgMascot from "figma:asset/95719912b4b688bc65402091998e22abcef9a383.png";

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
}

// Mock data
const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    type: "slack",
    message: `@tracyla I think the cmd-f <span class="font-['Hanken_Grotesk:Bold',sans-serif] font-bold">signage</span> looks cool!`,
    date: "10/01"
  },
  {
    id: "2",
    type: "slack",
    message: `@kashish I need the nwHacks <span class="font-['Hanken_Grotesk:Bold',sans-serif] font-bold">signage</span> by Monday...`,
    date: "22/12"
  },
  {
    id: "3",
    type: "notion",
    message: `@karenag uploaded nwHacks <span class="font-['Hanken_Grotesk:Bold',sans-serif] font-bold">signage</span>.`,
    date: "20/12"
  },
  {
    id: "4",
    type: "notion",
    message: `@karenag edited nwHacks <span class="font-['Hanken_Grotesk:Bold',sans-serif] font-bold">signage</span>.`,
    date: "20/12"
  },
  {
    id: "5",
    type: "notion",
    message: `@daksh created cmd-f <span class="font-['Hanken_Grotesk:Bold',sans-serif] font-bold">signage</span>.`,
    date: "18/12"
  },
  {
    id: "6",
    type: "notion",
    message: `@daksh created nwHacks <span class="font-['Hanken_Grotesk:Bold',sans-serif] font-bold">signage</span>.`,
    date: "18/12"
  }
];

function ReturnKeyIcon() {
  return (
    <div className="relative size-[24.02px]">
      <div className="absolute inset-[-5.71%_-11.43%_-17.14%_-11.43%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
          <g id="Group 75">
            <g filter="url(#filter0_d_return)" id="Rectangle 1">
              <path d={svgPaths.p2ebec280} shapeRendering="crispEdges" stroke="var(--stroke-0, #8E8E93)" strokeWidth="0.686275" />
            </g>
            <g id="keyboard_return">
              <g id="icon">
                <path d={svgPaths.p319d7a00} fill="#7F7F7F" fillOpacity="0.5" style={{ mixBlendMode: "luminosity" }} />
                <path d={svgPaths.p319d7a00} fill="#3D3D3D" style={{ mixBlendMode: "overlay" }} />
              </g>
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="29.5098" id="filter0_d_return" width="29.5098" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1.37255" />
              <feGaussianBlur stdDeviation="1.37255" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_1457" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_1457" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

export function Dashboard({ searchQuery, activeApps, onBack, onSearchChange }: DashboardProps) {
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [showNotionPopup, setShowNotionPopup] = useState(false);

  const filteredResults = mockSearchResults.filter(result => {
    if (result.type === "slack" && !activeApps.Slack) return false;
    if (result.type === "notion" && !activeApps.Notion) return false;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const messageText = result.message.replace(/<[^>]*>/g, '').toLowerCase(); // Remove HTML tags
      return messageText.includes(query);
    }
    
    return true;
  });

  // Auto-select first result to always show summary
  const effectiveSelectedResult = selectedResult || (filteredResults.length > 0 ? filteredResults[0].id : null);

  const handleResultClick = (result: SearchResult) => {
    setSelectedResult(result.id);
    if (result.type === "notion") {
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
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="group-hover:translate-x-[-2px] transition-transform">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
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
          placeholder="prompt here"
          className="flex-1 bg-transparent border-none outline-none font-['Instrument_Serif:Regular',sans-serif] leading-[normal] not-italic text-[32px] text-black placeholder:text-[rgba(60,60,67,0.6)] cursor-text"
          onKeyDown={handleKeyDown}
        />
        <div className="content-stretch flex gap-[3px] items-center justify-end">
          <p className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal leading-[normal] text-[#3d3d3d] text-[17.157px] text-nowrap whitespace-pre">enter</p>
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
          <p className="absolute font-['Instrument_Serif:Regular',sans-serif] leading-[normal] left-[30px] not-italic text-[28px] text-black text-nowrap top-[30px] whitespace-pre">
            search results
          </p>
          <div className="absolute h-0 left-[31px] top-[70px] w-[145px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-2px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 165 2">
                <line stroke="var(--stroke-0, #051B78)" strokeWidth="2" x2="165" y1="1" y2="1" />
              </svg>
            </div>
          </div>

          {/* Search results list - no horizontal scroll, with proper spacing */}
          <div className="absolute left-[38px] top-[90px] right-[30px] bottom-[20px] overflow-y-auto overflow-x-hidden">
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
          </div>
        </div>

        {/* Right side - Summary & Information (always shown) */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
          {/* Summary section */}
          <p className="absolute font-['Instrument_Serif:Regular',sans-serif] leading-[normal] left-[30px] not-italic text-[28px] text-black text-nowrap top-[30px] whitespace-pre">
            summary
          </p>
          <div className="absolute h-0 left-[30px] top-[70px] w-[105px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-2px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 125 2">
                <line stroke="var(--stroke-0, #051B78)" strokeWidth="2" x2="125" y1="1" y2="1" />
              </svg>
            </div>
          </div>

          {/* Summary content */}
          <div className="absolute left-[30px] top-[90px] right-[30px] max-h-[38%] overflow-y-auto">
            <div className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal text-[13px] text-black leading-[1.5]">
              <p className="font-['Hanken_Grotesk:Bold',sans-serif] font-bold mb-2">nwHacks Signage</p>
              <p className="mb-3">
                Lots of people were talking about the nwHacks signage! On Slack, @tracyl and @kashish chatted about it, shared feedback, and coordinated when it needed to be done. In Notion, @daksh first created the signage on Dec 18, and @karenag later jumped in on Dec 20 to upload and polish the updated version. Overall, it was definitely a team effort with everyone touching a different piece of the puzzle.
              </p>
              <p className="font-['Hanken_Grotesk:Bold',sans-serif] font-bold mb-2">cmd-f Signage</p>
              <p>
                There were also a few mentions of the cmd-f signage popping up. @daksh created it on Dec 18, and @tracyl commented on it in Slack (she thought it looked pretty cool). While it wasn't the main focus of this search, it shows that cmd-f and nwHacks signage work were happening around the same time and in similar threads.
              </p>
            </div>
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
          <p className="absolute font-['Instrument_Serif:Regular',sans-serif] leading-[normal] left-[30px] not-italic text-[28px] text-black text-nowrap top-[calc(58%+25px)] whitespace-pre">
            information
          </p>
          <div className="absolute h-0 left-[30px] top-[calc(58%+65px)] w-[130px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-2px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 150 2">
                <line stroke="var(--stroke-0, #051B78)" strokeWidth="2" x2="150" y1="1" y2="1" />
              </svg>
            </div>
          </div>

          {/* Information content */}
          <div className="absolute left-[30px] top-[calc(58%+85px)] right-[30px] bottom-[20px]">{selectedResult ? (
            <div className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal text-[13px] text-[#8e8e93] leading-[1.8] space-y-1">
              <div className="flex justify-between">
                <span>channel name</span>
                <span className="text-black"># team-cmd-f</span>
              </div>
              <div className="flex justify-between">
                <span>from</span>
                <span className="text-black">Tracy La</span>
              </div>
              <div className="flex justify-between">
                <span>posted</span>
                <span className="text-black">Jan 1, 2026</span>
              </div>
            </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full max-h-[180px]">
                <p className="font-['Hanken_Grotesk:Regular',sans-serif] text-[15px] text-[#8e8e93] mb-3">
                  This space is all clear!
                </p>
                <img src={imgMascot.src} alt="Cloud" className="w-[80px] h-auto mb-3" />
                <p className="font-['Hanken_Grotesk:Regular',sans-serif] text-[15px] text-[#8e8e93]">
                  Try selecting a search result to explore.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notion Popup */}
      {showNotionPopup && (
        <NotionPopup onClose={() => setShowNotionPopup(false)} />
      )}
    </div>
  );
}