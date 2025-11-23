import imgSlack from "figma:asset/c83971c90bff75db17f07aa1d9f05cd71d6ca2b0.png";
import imgNotion from "figma:asset/54bfd4a3d4588e15cd90e5ddc6efe79fa7b9c9f2.png";

interface SearchResultItemProps {
  type: "slack" | "notion";
  message: string;
  date: string;
  isSelected: boolean;
  onClick: () => void;
}

export function SearchResultItem({ type, message, date, isSelected, onClick }: SearchResultItemProps) {
  const img = type === "slack" ? imgSlack : imgNotion;
  
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-[16px] py-3 px-2 rounded-lg transition-colors ${
        isSelected ? 'bg-[rgba(5,27,120,0.3)]' : 'hover:bg-[rgba(5,27,120,0.1)]'
      }`}
    >
      <div className="flex items-center gap-[16px] flex-1 min-w-0">
        <div className="relative shrink-0 size-[30px]">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img} />
        </div>
        <div className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal text-[16px] text-black text-left leading-[normal] flex-1 min-w-0 overflow-hidden">
          <p className="leading-[normal] truncate" dangerouslySetInnerHTML={{ __html: message }} />
        </div>
      </div>
      <div className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal text-[#8e8e93] text-[16px] text-nowrap shrink-0">
        <p className="leading-[normal]">{date}</p>
      </div>
    </button>
  );
}