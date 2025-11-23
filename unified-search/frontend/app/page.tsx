"use client";

import { useState, useEffect } from "react";
import svgPaths from "../src/imports/svg-mtjcj8eugv";
import logo2 from "../src/assets/logo2.png";
import returnKeySvgPaths from "../src/imports/svg-fl3ymrnpwd";
import { Background } from "../src/components/Background";
import { CloudCharacter } from "../src/components/CloudCharacter";
import { AppChip } from "../src/components/AppChip";
import { Dashboard } from "../src/components/Dashboard";
import { InlineSearchResults } from "../src/components/InlineSearchResults";
import { AddAppPopup } from "../src/components/AddAppPopup";
import { extractTextSnippet } from "../src/utils/textSnippet";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface BackendSearchResult {
  source: string;
  title: string;
  text: string;
  author?: string;
  date?: string;
  link?: string;
}

function AddIcon() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="add">
        <g id="icon">
          <path d={svgPaths.p2a6e0600} fill="#7F7F7F" fillOpacity="0.5" style={{ mixBlendMode: "luminosity" }} />
          <path d={svgPaths.p2a6e0600} fill="#3D3D3D" style={{ mixBlendMode: "overlay" }} />
        </g>
      </g>
    </svg>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeApps, setActiveApps] = useState<Record<string, boolean>>({
    Slack: false,
    Notion: false,
  });
  const [showDashboard, setShowDashboard] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  const [showAddAppPopup, setShowAddAppPopup] = useState(false);
  const [hasAddedApps, setHasAddedApps] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ id: string; type: "slack" | "notion"; message: string; date?: string }>>([]);
  const [loading, setLoading] = useState(false);

  // Fetch search results from backend as user types
  useEffect(() => {
    // Don't search if no query or no apps active
    if (!searchQuery.trim() || !Object.values(activeApps).some(active => active)) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // AbortController to cancel previous requests
    const abortController = new AbortController();

    const fetchResults = async () => {
      setLoading(true);
      try {
        let response: Response;
        try {
          response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: abortController.signal,
          });
        } catch (fetchError: any) {
          // Handle network errors (backend not running, CORS, etc.)
          if (fetchError.name === 'AbortError') {
            return; // Request was cancelled, ignore
          }
          console.error("Network error:", fetchError);
          throw new Error(`Cannot connect to backend at ${API_BASE_URL}. Make sure the backend server is running on port 4000.`);
        }

        if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`);
        }

        const backendResults: BackendSearchResult[] = await response.json();
        
        // Transform to frontend format
        const transformed = backendResults
          .filter((result) => {
            // Filter by active apps
            if (result.source === "slack" && !activeApps.Slack) return false;
            if (result.source === "notion" && !activeApps.Notion) return false;
            return true;
          })
          .map((result, index) => {
            // Extract snippet around search query (not full text)
            const highlightedText = extractTextSnippet(result.text || "", searchQuery, 100);

            // Format date
            let dateStr = "";
            if (result.date) {
              try {
                const date = new Date(result.date);
                if (!isNaN(date.getTime())) {
                  dateStr = `${date.getDate()}/${date.getMonth() + 1}`;
                }
              } catch (e) {
                // Invalid date
              }
            }

            // Generate unique ID
            const linkPart = (result.link || result.title || 'unknown').substring(0, 50);
            const textHash = (result.text || "").substring(0, 20).replace(/[^a-zA-Z0-9]/g, '');
            const uniqueId = `${result.source}-${linkPart}-${textHash}-${result.date || index}-${index}`;

            return {
              id: uniqueId,
              type: result.source as "slack" | "notion",
              message: highlightedText || "No content",
              date: dateStr,
            };
          });

        setSearchResults(transformed);
        setShowSearchResults(transformed.length > 0);
        setSelectedResultIndex(0);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return; // Request was cancelled, ignore
        }
        console.error("Error fetching search results:", err);
        // Only show error if it's not a connection error (user will see empty results)
        if (err.message && err.message.includes('Cannot connect to backend')) {
          console.warn("Backend server appears to be offline. Please start the backend server.");
        }
        setSearchResults([]);
        setShowSearchResults(false);
      } finally {
        setLoading(false);
      }
    };

    // Search immediately on every keystroke
    fetchResults();

    return () => {
      abortController.abort();
    };
  }, [searchQuery, activeApps]);

  const filteredResults = searchResults;

  const handleToggleApp = (app: string) => {
    setActiveApps(prev => ({
      ...prev,
      [app]: !prev[app]
    }));
  };

  const handleOpenResult = () => {
    // Cmd+Enter: Open the actual message in Slack/Notion (mock for now)
    const selectedResult = filteredResults[selectedResultIndex];
    if (selectedResult) {
      alert(`Opening ${selectedResult.type} message: ${selectedResult.message.replace(/<[^>]*>/g, '')}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && showSearchResults) {
      // Enter goes to dashboard when results are showing
      setShowDashboard(true);
      setShowSearchResults(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // The useEffect will handle fetching and showing results automatically
    // Only show dropdown if NO apps are active
    setShowDropdown(value.length > 0 && !Object.values(activeApps).some(active => active));
  };

  const handleBackToSearch = () => {
    setShowDashboard(false);
    setShowSearchResults(false);
  };

  // Mock suggestions for dropdown
  const suggestions = [
    "signage",
    "nwHacks planning",
    "cmd-f updates",
    "design files",
    "meeting notes"
  ];

  const filteredSuggestions = suggestions.filter(s =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showDashboard) {
    return (
      <Dashboard
        searchQuery={searchQuery}
        activeApps={activeApps}
        onBack={handleBackToSearch}
        onSearchChange={setSearchQuery}
      />
    );
  }

  return (
    <div className="bg-[#faf9f6] relative size-full min-h-screen overflow-hidden" data-name="kumo portal">
      <Background />

      {/* Logo */}
      <div className="absolute box-border content-stretch flex flex-col items-start leading-[normal] left-[57px] pb-0 pt-0 px-0 top-[28px] w-[125px]">
        <img src={logo2.src} alt="komo" className="relative shrink-0 w-full h-[100px] object-contain" />
      </div>

      {/* Main content area - animates up when search results appear */}
      <div
        className={`absolute left-[374px] right-[374px] transition-all duration-300 ease-in-out ${showSearchResults ? 'top-[67px]' : 'top-[297px]'
          }`}
      >
        {/* Question text - now as placeholder in input */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="what are you looking for?"
          className="w-full bg-transparent border-none outline-none not-italic text-[40px] text-black placeholder:text-[rgba(60,60,67,0.6)] mb-[10px]"
        />

        {/* Line under question */}
        <div className="relative h-0 w-full mb-[22px]">
          <div className="absolute inset-[-4px_0_-8px_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 580 12">
              <g filter="url(#filter0_d_line)" id="line">
                <path d="M6 4H573.5" stroke="var(--stroke-0, #051B78)" strokeLinecap="round" strokeWidth="4" />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="12" id="filter0_d_line" width="579.5" x="0" y="0">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                  <feOffset dy="2" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                  <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_1023" />
                  <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_1023" mode="normal" result="shape" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>

        {/* Inline Search Results */}
        {showSearchResults && (
          <InlineSearchResults
            results={filteredResults}
            selectedIndex={selectedResultIndex}
            onSelectIndex={setSelectedResultIndex}
            onOpenResult={handleOpenResult}
            searchQuery={searchQuery}
          />
        )}

        {/* Dropdown suggestions - only show when not showing search results */}
        {!showSearchResults && showDropdown && filteredSuggestions.length > 0 && (
          <div className="absolute top-[80px] left-0 right-0 bg-white rounded-[12px] border-2 border-[#051B78] shadow-lg z-10 overflow-hidden">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchQuery(suggestion);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-6 py-3 hover:bg-[rgba(5,27,120,0.1)] transition-colors font-['Hanken_Grotesk:Regular',sans-serif] text-[18px] text-black"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* App chips and New Item button - hide when search results are showing */}
        {!showSearchResults && (
          <div className="flex gap-3 items-center mt-[4px]">
            {/* Only show app chips if apps have been added */}
            {hasAddedApps && (
              <>
                {activeApps.Slack && <AppChip app="Slack" isActive={activeApps.Slack} onToggle={() => handleToggleApp("Slack")} />}
                {activeApps.Notion && <AppChip app="Notion" isActive={activeApps.Notion} onToggle={() => handleToggleApp("Notion")} />}
              </>
            )}

            {/* Add button */}
            <button
              onClick={() => setShowAddAppPopup(true)}
              className="relative h-[37px] group"
            >
              <div className="absolute inset-[-5.41%_-3.48%_-16.22%_-3.48%]" style={{ "--stroke-0": "rgba(142, 142, 147, 1)" } as React.CSSProperties}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 123 45">
                  <g filter="url(#filter0_d_add_btn)" id="Rectangle 1">
                    <path d={svgPaths.p243f0080} shapeRendering="crispEdges" stroke="var(--stroke-0, #8E8E93)" className="group-hover:stroke-[#051B78] transition-colors" />
                  </g>
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="45" id="filter0_d_add_btn" width="123" x="0" y="0">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                      <feOffset dy="2" />
                      <feGaussianBlur stdDeviation="2" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                      <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_970" />
                      <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_970" mode="normal" result="shape" />
                    </filter>
                  </defs>
                </svg>
              </div>
              <div className="relative flex items-center gap-2 px-4">
                <div className="size-[24px]">
                  <AddIcon />
                </div>
                <span className="leading-[normal] not-italic text-[20px] text-[rgba(60,60,67,0.6)] whitespace-pre">
                  {hasAddedApps ? "add" : "new item"}
                </span>
              </div>
            </button>
          </div>
        )}

        {/* Enter hint when search results are showing */}
        {showSearchResults && (
          <div className="absolute right-0 top-[30px] content-stretch flex gap-[3px] items-center justify-end">
            <p className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal leading-[normal] text-[#3d3d3d] text-[17.157px] text-nowrap whitespace-pre ">enter </p>
            <div className="relative shrink-0 size-[24.02px]">
              <div className="absolute inset-[-5.71%_-11.43%_-17.14%_-11.43%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
                  <g id="Group 75">
                    <g filter="url(#filter0_d_enter_key)" id="Rectangle 1">
                      <path d={returnKeySvgPaths.p2ebec280} shapeRendering="crispEdges" stroke="var(--stroke-0, #3d3d3d)" strokeWidth="0.686275" />
                    </g>
                    <g id="keyboard_return">
                      <g id="icon">
                        <path d={returnKeySvgPaths.p319d7a00} fill="#3d3d3d" fillOpacity="0.5" style={{ mixBlendMode: "luminosity" }} />
                        <path d={returnKeySvgPaths.p319d7a00} fill="#3D3D3D" style={{ mixBlendMode: "overlay" }} />
                      </g>
                    </g>
                  </g>
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="29.5098" id="filter0_d_enter_key" width="29.5098" x="0" y="0">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                      <feOffset dy="1.37255" />
                      <feGaussianBlur stdDeviation="1.37255" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                      <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_enter" />
                      <feBlend in="SourceGraphic" in2="effect1_dropShadow_enter" mode="normal" result="shape" />
                    </filter>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cloud Character */}
      <CloudCharacter />

      {/* Add App Popup */}
      {showAddAppPopup && (
        <AddAppPopup
          onClose={() => setShowAddAppPopup(false)}
          onAddApp={(app) => {
            setActiveApps(prev => ({ ...prev, [app]: true }));
            setHasAddedApps(true);
          }}
          onToggleApp={(app) => {
            setActiveApps(prev => ({ ...prev, [app]: !prev[app] }));
            setHasAddedApps(Object.values({ ...activeApps, [app]: !activeApps[app] }).some(active => active));
          }}
          addedApps={activeApps}
        />
      )}
    </div>
  );
}
