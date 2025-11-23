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
      {/* Overlay - subtle backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Modal - Notion-like design */}
      <div
        className="relative bg-white rounded-lg shadow-2xl w-[90vw] max-w-[900px] h-[85vh] max-h-[700px] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}
      >
        {/* Header - Notion-style */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
          <h1 className="text-2xl font-semibold text-gray-900 flex-1 min-w-0 truncate pr-4">
            {title}
          </h1>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content area - Notion-style with proper padding and typography */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-[720px] mx-auto px-8 py-6">
            <div
              className="text-[15px] leading-[1.6] text-gray-800 whitespace-pre-wrap"
              style={{
                fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
                color: 'rgb(55, 53, 47)'
              }}
              dangerouslySetInnerHTML={{ __html: highlightedContent || "No content available." }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
