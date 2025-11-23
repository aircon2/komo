import { X, Check } from "lucide-react";
import slack from "../assets/slack.png";
import notion from "../assets/notion.png";

interface AddAppPopupProps {
  onClose: () => void;
  onAddApp: (app: "Slack" | "Notion") => void;
  addedApps: Record<string, boolean>;
  onToggleApp?: (app: "Slack" | "Notion") => void; // Optional toggle handler
}

export function AddAppPopup({ onClose, onAddApp, addedApps, onToggleApp }: AddAppPopupProps) {
  // Use toggle if provided, otherwise use add
  const handleAppClick = (app: "Slack" | "Notion") => {
    if (onToggleApp) {
      onToggleApp(app);
    } else if (!addedApps[app]) {
      onAddApp(app);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-white rounded-[30px] w-[520px] px-[60px] py-[50px] shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Blue border */}
        <div aria-hidden="true" className="absolute border-[3px] border-[#051b78] border-solid inset-0 pointer-events-none rounded-[30px]" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-[20px] right-[25px] text-[#8e8e93] hover:text-[#051b78] transition-colors"
        >
          <X className="size-6" />
        </button>

        {/* Title */}
        <h2 className="text-[40px] text-black mb-[35px]">
          choose your app:
        </h2>

        {/* App options */}
        <div className="flex gap-[16px]">
          {/* Slack button */}
          <button
            onClick={() => handleAppClick("Slack")}
            className={`relative flex items-center gap-[10px] px-[18px] py-[10px] rounded-[10px] border-2 transition-all ${addedApps.Slack
              ? "border-[#34C759] bg-[#34C759]/10 cursor-pointer hover:bg-[#34C759]/20"
              : "border-[#8e8e93] hover:border-[#051b78] cursor-pointer"
              }`}
          >
            {/* <MessageSquare className="size-[24px] text-[#4A154B]" /> */}
            <img src={slack.src} alt="Slack Logo" className="size-[24px] object-contain" />
            <span className="font-['Hanken_Grotesk:Regular',sans-serif] text-[18px] text-black">
              Slack
            </span>
            {addedApps.Slack && (
              <Check className="ml-1 size-5 text-[#34C759]" />
            )}
          </button>

          {/* Notion button */}
          <button
            onClick={() => handleAppClick("Notion")}
            className={`relative flex items-center gap-[10px] px-[18px] py-[10px] rounded-[10px] border-2 transition-all ${addedApps.Notion
              ? "border-[#34C759] bg-[#34C759]/10 cursor-pointer hover:bg-[#34C759]/20"
              : "border-[#8e8e93] hover:border-[#051b78] cursor-pointer"
              }`}
          >
            {/* <FileText className="size-[24px] text-black" /> */}
            <img src={notion.src} alt="Notion Logo" className="size-[24px] object-contain" />
            <span className="font-['Hanken_Grotesk:Regular',sans-serif] text-[18px] text-black">
              Notion
            </span>
            {addedApps.Notion && (
              <Check className="ml-1 size-5 text-[#34C759]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
