import { X } from "lucide-react";
import { highlightText } from "../utils/textSnippet";

interface ThreadMessage {
  text: string;
  author: string;
  date: string;
}

interface SlackPopupProps {
  channel: string;
  mainMessage: ThreadMessage;
  threadReplies: ThreadMessage[];
  searchQuery: string;
  onClose: () => void;
}

export function SlackPopup({ channel, mainMessage, threadReplies, searchQuery, onClose }: SlackPopupProps) {
  // Format channel name with # prefix if not already present
  const formattedChannel = channel.startsWith("#") ? channel : `#${channel}`;
  
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "";
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-[rgba(183,183,188,0.6)]" />
      
      {/* Modal */}
      <div
        className="relative bg-[#faf9f6] rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.15)] w-[823px] h-[500px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div aria-hidden="true" className="absolute border-4 border-[#051b78] border-solid inset-0 pointer-events-none rounded-[20px]" />
        
        {/* Header with channel name */}
        <div className="absolute left-[50px] top-[39px] right-[80px]">
          <h2 className="font-['Lato:Regular',sans-serif] text-[18px] text-black leading-[normal] truncate">
            {formattedChannel}
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
          <div className="space-y-4">
            {/* Main message */}
            <div className="border-l-2 border-[#051b78] pl-4 py-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-['Hanken_Grotesk:Bold',sans-serif] font-bold text-[14px] text-black">
                  {mainMessage.author}
                </span>
                <span className="font-['Hanken_Grotesk:Regular',sans-serif] text-[12px] text-[#8e8e93]">
                  {formatDate(mainMessage.date)} at {formatTime(mainMessage.date)}
                </span>
              </div>
              <div
                className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal text-[14px] text-black leading-[1.6] whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: highlightText(mainMessage.text, searchQuery) }}
              />
            </div>

            {/* Thread replies */}
            {threadReplies.length > 0 && (
              <div className="ml-4 space-y-3 border-l-2 border-[#8e8e93] pl-4">
                {threadReplies.map((reply, index) => (
                  <div key={index} className="py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-['Hanken_Grotesk:Bold',sans-serif] font-bold text-[13px] text-black">
                        {reply.author}
                      </span>
                      <span className="font-['Hanken_Grotesk:Regular',sans-serif] text-[11px] text-[#8e8e93]">
                        {formatDate(reply.date)} at {formatTime(reply.date)}
                      </span>
                    </div>
                    <div
                      className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal text-[13px] text-black leading-[1.6] whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: highlightText(reply.text, searchQuery) }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

