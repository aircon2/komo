import { useEffect } from "react";
import slack from "../assets/slack.png";
import notion from "../assets/notion.png";
import { CornerDownLeft } from "lucide-react";

interface SearchResult {
  id: string;
  type: "slack" | "notion";
  message: string;
  date?: string;
  link?: string;
}

interface InlineSearchResultsProps {
  results: SearchResult[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onOpenResult: () => void;
  searchQuery: string;
  onOpenLink?: (link: string) => void; // Optional callback for opening links
}

function ReturnKeyIcon() {
  return (
    <div className="relative shrink-0 size-[24.02px] flex items-center justify-center">
      <div className="border border-[#8E8E93] rounded px-1 py-0.5 bg-white shadow-sm">
        <CornerDownLeft className="size-3 text-[#3D3D3D]" />
      </div>
    </div>
  );
}

export function InlineSearchResults({ results, selectedIndex, onSelectIndex, onOpenResult, searchQuery, onOpenLink }: InlineSearchResultsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        onSelectIndex(Math.min(selectedIndex + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        onSelectIndex(Math.max(selectedIndex - 1, 0));
      } else if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        // Cmd+Enter: Open link if available, otherwise use onOpenResult
        const selectedResult = results[selectedIndex];
        if (selectedResult && selectedResult.link) {
          if (onOpenLink) {
            onOpenLink(selectedResult.link);
          } else {
            window.open(selectedResult.link, '_blank', 'noopener,noreferrer');
          }
        } else {
          onOpenResult();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, results.length, onSelectIndex, onOpenResult, results, onOpenLink]);

  // highlight matching text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    return text.replace(regex, "<strong>$1</strong>");
  };

  return (
    <div className="w-full mt-4 fade-in-slide">
      <div className="relative bg-white rounded-[20px] w-full overflow-hidden shadow-sm">
        {/* Blue border */}
        <div
          aria-hidden="true"
          className="absolute inset-0 border-[3px] border-[#051b78] border-solid pointer-events-none rounded-[20px]"
        />

        {/* Results list */}
        <div className="px-[32px] py-[28px] max-h-[400px] overflow-y-auto">
          <div className="flex flex-col gap-[16px]">
            {results.length === 0 ? (
              <div className="w-full flex items-center justify-center py-12">
                <span className="font-['Hanken_Grotesk:Regular',sans-serif] text-[17px] text-[#3d3d3d]">
                  no results found :(
                </span>
              </div>
            ) : (
              results.map((result, index) => {
                const isSelected = index === selectedIndex;
                const iconImg = result.type === "slack" ? slack : notion;

                const handleClick = (e: React.MouseEvent) => {
                  // Cmd+Click (Mac) or Ctrl+Click (Windows/Linux) opens link in new tab
                  if (e.metaKey || e.ctrlKey) {
                    if (result.link) {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(result.link, '_blank', 'noopener,noreferrer');
                      return;
                    }
                  }
                  // Regular click selects the item
                  onSelectIndex(index);
                };

                return (
                  <button
                    key={result.id}
                    onClick={handleClick}
                    onDoubleClick={onOpenResult}
                    className={`relative w-full text-left py-[12px] px-[12px] rounded-[8px] transition-colors duration-150 ${
                      isSelected
                        ? "bg-[rgba(5,27,120,0.15)]"
                        : "hover:bg-[rgba(5,27,120,0.05)]"
                    }`}
                  >
                    <div className="relative flex items-center gap-[14px] w-full">
                      <div className="shrink-0 size-[28px] flex items-center justify-center">
                        <img
                          src={iconImg.src}
                          alt={result.type}
                          className="size-[28px] object-contain"
                        />
                      </div>

                      <div className="font-['Hanken_Grotesk:Regular',sans-serif] text-[15px] text-black leading-[1.4] flex-1">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: highlightText(result.message, searchQuery),
                          }}
                        />
                      </div>

                      {isSelected && (
                        <div className="flex gap-[6px] items-center shrink-0">
                          <p className="font-['Hanken_Grotesk:Regular',sans-serif] text-[15px] text-[#3d3d3d]">
                            cmd + enter
                          </p>
                          <ReturnKeyIcon />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}