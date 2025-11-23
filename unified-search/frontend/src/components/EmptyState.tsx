import { Cloud } from "lucide-react";

function SmallCloudCharacter() {
  return (
    <div className="relative h-[60.25px] w-[63.873px] opacity-50 flex items-center justify-center" data-name="cloud body/Variant5">
      <Cloud className="size-full text-[#5581FF]" />
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <SmallCloudCharacter />
      <p className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal text-[#8e8e93] text-[18px] text-center mt-4">
        This space is all clear!
      </p>
      <p className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal text-[#8e8e93] text-[18px] text-center mt-4">
        Try selecting a search result to explore.
      </p>
    </div>
  );
}
