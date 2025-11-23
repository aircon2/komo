import { useEffect } from "react";
import slack from "../assets/slack.png";
import notion from "../assets/notion.png";
import { CornerDownLeft } from "lucide-react";

interface SearchResult {
  id: string;
  type: "slack" | "notion";
  message: string;
  date?: string;
}

interface InlineSearchResultsProps {
  results: SearchResult[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onOpenResult: () => void;
  searchQuery: string;
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

export function InlineSearchResults({ results, selectedIndex, onSelectIndex, onOpenResult, searchQuery }: InlineSearchResultsProps) {
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
        onOpenResult();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, results.length, onSelectIndex, onOpenResult]);

  // Function to highlight matching text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  };

  return (
    <div className="absolute left-[-100px] right-[-100px] top-[120px] animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="relative bg-white rounded-[20px] mx-auto w-full max-w-[880px] overflow-hidden">
        {/* Blue border */}
        <div aria-hidden="true" className="absolute border-[3px] border-[#051b78] border-solid inset-0 pointer-events-none rounded-[20px]" />

        {/* Results list */}
        <div className="px-[32px] py-[28px] max-h-[500px] overflow-y-auto">
          <div className="flex flex-col gap-[16px]">
            {results.length === 0 ? (
              <div className="w-full flex items-center justify-center py-12">
                <span className="font-['Hanken_Grotesk:Regular',sans-serif] text-[17px] text-[#3d3d3d]">no results found :(</span>
              </div>
            ) : (
              results.map((result, index) => {
                const isSelected = index === selectedIndex;
                const iconImg = result.type === "slack" ? slack : notion;

                return (
                  <button
                    key={result.id}
                    onClick={() => onSelectIndex(index)}
                    onDoubleClick={onOpenResult}
                    className={`relative w-full text-left py-[12px] px-[12px] -mx-[12px] rounded-[8px] transition-colors ${isSelected ? 'bg-[rgba(5,27,120,0.15)]' : 'hover:bg-[rgba(5,27,120,0.05)]'
                      }`}
                  >
                    {/* Content */}
                    <div className="relative flex items-center gap-[14px] w-full">
                      <div className="relative shrink-0 size-[28px] flex items-center justify-center">
                        <img src={iconImg.src} alt={result.type} className="size-[28px] object-contain" />
                      </div>
                      <div className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal text-[15px] text-black leading-[1.4] flex-1">
                        <p dangerouslySetInnerHTML={{ __html: highlightText(result.message, searchQuery) }} />
                      </div>

                      {/* Show cmd + enter hint on selected item */}
                      {isSelected && (
                        <div className="flex gap-[6px] items-center shrink-0">
                          <p className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal leading-[normal] text-[#3d3d3d] text-[15px] text-nowrap">
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