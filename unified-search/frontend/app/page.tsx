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
    <svg
      className="block size-full"
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 24 24"
    >
      <g id="add">
        <g id="icon">
          <path
            d={svgPaths.p2a6e0600}
            fill="#7F7F7F"
            fillOpacity="0.5"
            style={{ mixBlendMode: "luminosity" }}
          />
          <path
            d={svgPaths.p2a6e0600}
            fill="#3D3D3D"
            style={{ mixBlendMode: "overlay" }}
          />
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
  const [searchResults, setSearchResults] = useState<
    Array<{
      id: string;
      type: "slack" | "notion";
      message: string;
      date?: string;
    }>
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      !searchQuery.trim() ||
      !Object.values(activeApps).some((active) => active)
    ) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const abortController = new AbortController();

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/search?q=${encodeURIComponent(searchQuery)}`,
          {
            headers: { "Content-Type": "application/json" },
            signal: abortController.signal,
          }
        );
        if (!response.ok)
          throw new Error(`Search failed: ${response.statusText}`);
        const backendResults: BackendSearchResult[] = await response.json();

        const transformed = backendResults
          .filter((result) => {
            if (result.source === "slack" && !activeApps.Slack) return false;
            if (result.source === "notion" && !activeApps.Notion) return false;
            return true;
          })
          .map((result, index) => {
            const highlightedText = extractTextSnippet(
              result.text || "",
              searchQuery,
              100
            );
            let dateStr = "";
            if (result.date) {
              const d = new Date(result.date);
              if (!isNaN(d.getTime()))
                dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
            }

            const linkPart = (
              result.link ||
              result.title ||
              "unknown"
            ).substring(0, 50);
            const textHash = (result.text || "")
              .substring(0, 20)
              .replace(/[^a-zA-Z0-9]/g, "");
            const uniqueId = `${result.source}-${linkPart}-${textHash}-${
              result.date || index
            }-${index}`;
            return {
              id: uniqueId,
              type: result.source as "slack" | "notion",
              message: highlightedText || "No content",
              date: dateStr,
              link: result.link, // Include link for Cmd+Click functionality
            };
          });

        setSearchResults(transformed);
        setShowSearchResults(transformed.length > 0);
        setSelectedResultIndex(0);
      } catch (err: any) {
        if (err.name !== "AbortError")
          console.error("Error fetching results:", err);
        setSearchResults([]);
        setShowSearchResults(false);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    return () => abortController.abort();
  }, [searchQuery, activeApps]);

  const filteredResults = searchResults;

  const handleToggleApp = (app: string) =>
    setActiveApps((prev) => ({ ...prev, [app]: !prev[app] }));

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && showSearchResults) {
      setShowDashboard(true);
      setShowSearchResults(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowDropdown(
      value.length > 0 && !Object.values(activeApps).some((active) => active)
    );
  };

  if (showDashboard) {
    return (
      <Dashboard
        searchQuery={searchQuery}
        activeApps={activeApps}
        onBack={() => {
          setShowDashboard(false);
          setShowSearchResults(false);
        }}
        onSearchChange={setSearchQuery}
      />
    );
  }

  const suggestions = [
    "signage",
    "nwHacks planning",
    "cmd-f updates",
    "design files",
    "meeting notes",
  ];
  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-[#faf9f6]"
      data-name="kumo portal"
    >
      <Background />

      {/* Logo */}
      <div className="absolute top-[28px] left-[57px]">
        <img
          src={logo2.src}
          alt="komo"
          className="w-[125px] h-[100px] object-contain"
        />
        </div>

      {/* ---------- MAIN SEARCH AREA ---------- */}
      <main
        className="flex min-h-screen flex-col items-center justify-center transition-transform duration-200 ease-out will-change-transform"
        style={{ transform: showSearchResults ? 'translateY(-2.5rem)' : 'translateY(0)' }}
      >
        {/* Page content wrapper (centers on screen) */}
        <div className="flex w-full flex-col items-center justify-center text-left px-10 space-y-4">
          {/* Search input container - smaller width */}
          <div className="flex w-full max-w-3xl flex-col space-y-4">
            {/* Search input */}
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="what are you looking for?"
              className="w-full border-none bg-transparent text-[40px] text-black placeholder:text-[rgba(60,60,67,0.6)] outline-none font-instrument text-left"
            />

            {/* Underline */}
            <div className="relative w-full h-[4px]">
              <svg
                className="h-[8px] w-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 580 8"
              >
                <path
                  d="M0,4 L580,4"
                  stroke="#051B78"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
              </svg>
            </div>

            {/* Chips + Add App button */}
            {!showSearchResults && (
              <div className="flex items-center gap-3 pt-4 relative">
                {hasAddedApps && (
                  <>
                    {activeApps.Slack && (
                      <AppChip
                        app="Slack"
                        isActive={activeApps.Slack}
                        onToggle={() => handleToggleApp("Slack")}
                      />
                    )}
                    {activeApps.Notion && (
                      <AppChip
                        app="Notion"
                        isActive={activeApps.Notion}
                        onToggle={() => handleToggleApp("Notion")}
                      />
                    )}
                  </>
                )}
                <div className="relative">
                  <button
                    onClick={() => setShowAddAppPopup(true)}
                    className={`relative flex items-center gap-2 h-[37px] px-4 border rounded-md hover:border-[#051B78] transition-colors ${
                      !hasAddedApps ? "border-[#051B78]" : "border-neutral-300"
                    }`}
                    style={
                      !hasAddedApps
                        ? {
                            animation: "glow 2s ease-in-out infinite",
                            boxShadow:
                              "0 0 10px rgba(5, 27, 120, 0.5), 0 0 20px rgba(5, 27, 120, 0.3)",
                          }
                        : {}
                    }
                  >
                    <div className="size-[24px]">
                      <AddIcon />
                    </div>
                    <span className="text-[20px] text-neutral-600 font-['Hanken_Grotesk:Regular',sans-serif]">
                      {hasAddedApps ? "add" : "new item"}
                    </span>
                  </button>

                  {/* Arrow and text pointing to button - only show when no apps added */}
                  {!hasAddedApps && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 flex items-center" style={{ marginLeft: '4px' }}>
                      {/* Left-pointing arrow */}
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-[#051B78] shrink-0"
                      >
                        <path
                          d="M15 18L9 12L15 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {/* Text */}
                      <span className="font-['Hanken_Grotesk:Regular',sans-serif] text-[15px] text-[rgba(60,60,67,0.6)] whitespace-nowrap ml-1">
                        add an app to search
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Search results container - larger width */}
          {showSearchResults && (
            <div className="w-full max-w-5xl mt-2">
              <InlineSearchResults
                results={filteredResults}
                selectedIndex={selectedResultIndex}
                onSelectIndex={setSelectedResultIndex}
                onOpenResult={() => {
                  const selected = filteredResults[selectedResultIndex];
                  if (selected)
                    alert(
                      `Opening ${
                        selected.type
                      } message: ${selected.message.replace(/<[^>]*>/g, "")}`
                    );
                }}
                searchQuery={searchQuery}
              />
            </div>
          )}
        </div>
      </main>

      {/* Cloud Character */}
      <CloudCharacter />

      {/* Add App Popup */}
      {showAddAppPopup && (
        <AddAppPopup
          onClose={() => setShowAddAppPopup(false)}
          onAddApp={(app) => {
            setActiveApps((prev) => ({ ...prev, [app]: true }));
            setHasAddedApps(true);
          }}
          onToggleApp={(app) => {
            setActiveApps((prev) => ({ ...prev, [app]: !prev[app] }));
            setHasAddedApps(
              Object.values({ ...activeApps, [app]: !activeApps[app] }).some(
                (active) => active
              )
            );
          }}
          addedApps={activeApps}
        />
      )}
    </div>
  );
}
