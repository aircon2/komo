import { X, Heart } from "lucide-react";

interface NotionPopupProps {
  onClose: () => void;
}

export function NotionPopup({ onClose }: NotionPopupProps) {
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
        
        {/* Header with directory path */}
        <div className="absolute left-[50px] top-[39px] content-stretch flex gap-[5px] items-end">
          <Heart className="size-[18px] fill-[#FF9B9B] text-[#FF9B9B]" />
          <div className="flex flex-col font-['Lato:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[15px] text-black text-center text-nowrap">
            <p className="leading-[normal] whitespace-pre">nwHacks 2026 </p>
          </div>
          <p className="font-['Lato:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.6)] text-nowrap whitespace-pre">/</p>
          <Heart className="size-[18px] fill-[#FF9B9B] text-[#FF9B9B]" />
          <p className="font-['Lato:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[15px] text-black text-nowrap whitespace-pre">signage</p>
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

        {/* Content area - empty for now, could be filled with Notion page content */}
        <div className="absolute left-[50px] right-[50px] top-[110px] bottom-[50px]">
          <div className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal text-[14px] text-[#8e8e93] text-center">
            <p>Notion page content would appear here...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
