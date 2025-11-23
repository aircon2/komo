import { useEffect } from "react";
import svgPaths from "../imports/svg-fl3ymrnpwd";
import imgSlack from "figma:asset/c83971c90bff75db17f07aa1d9f05cd71d6ca2b0.png";
import imgNotion from "figma:asset/54bfd4a3d4588e15cd90e5ddc6efe79fa7b9c9f2.png";

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
    <div className="relative shrink-0 size-[24.02px]">
      <div className="absolute inset-[-5.71%_-11.43%_-17.14%_-11.43%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
          <g id="Group 75">
            <g filter="url(#filter0_d_inline_key)" id="Rectangle 1">
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
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="29.5098" id="filter0_d_inline_key" width="29.5098" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1.37255" />
              <feGaussianBlur stdDeviation="1.37255" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_inline" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_inline" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
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
            {results.map((result, index) => {
              const isSelected = index === selectedIndex;
              const imgSrc = result.type === "slack" ? imgSlack : imgNotion;
              
              return (
                <button
                  key={result.id}
                  onClick={() => onSelectIndex(index)}
                  onDoubleClick={onOpenResult}
                  className={`relative w-full text-left py-[12px] px-[12px] -mx-[12px] rounded-[8px] transition-colors ${
                    isSelected ? 'bg-[rgba(5,27,120,0.15)]' : 'hover:bg-[rgba(5,27,120,0.05)]'
                  }`}
                >
                  {/* Content */}
                  <div className="relative flex items-center gap-[14px] w-full">
                    <div className="relative shrink-0 size-[28px]">
                      <img alt="" className="size-full object-cover rounded-[4px]" src={imgSrc} />
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
            })}
          </div>
        </div>
      </div>
    </div>
  );
}