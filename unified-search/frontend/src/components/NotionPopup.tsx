import { X } from "lucide-react";
import { highlightText } from "../utils/textSnippet";

interface NotionPopupProps {
  title: string;
  content: string;
  searchQuery: string;
  onClose: () => void;
}

export function NotionPopup({ title, content, searchQuery, onClose }: NotionPopupProps) {
  // Highlight search keywords in the content
  const highlightedContent = highlightText(content, searchQuery);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-[rgba(183,183,188,0.6)]" />
      
      {/* Modal */}
      <div
        className="relative bg-[#faf9f6] rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.15)] w-[823px] h-[405px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div aria-hidden="true" className="absolute border-4 border-[#051b78] border-solid inset-0 pointer-events-none rounded-[20px]" />
        
        {/* Header with page title */}
        <div className="absolute left-[50px] top-[39px] right-[80px]">
          <h2 className="font-['Lato:Regular',sans-serif] text-[18px] text-black leading-[normal] truncate">
            {title}
          </h2>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-[30px] top-[30px] text-[rgba(0,0,0,0.6)] hover:text-black transition-colors"
        >
          <X className="size-6" />
        </button>

        {/* Horizontal divider */}
        <div className="absolute left-[41px] right-[41px] top-[88px]">
          <div className="h-[1.028px] w-full">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 740 2">
              <path d="M740 0H0V1.02792H740V0Z" fill="var(--fill-0, black)" fillOpacity="0.1" />
            </svg>
          </div>
        </div>

        {/* Content area - scrollable */}
        <div className="absolute left-[50px] right-[50px] top-[110px] bottom-[50px] overflow-y-auto">
          <div
            className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal text-[14px] text-black leading-[1.6] whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: highlightedContent || "No content available." }}
          />
        </div>
      </div>
    </div>
  );
}
