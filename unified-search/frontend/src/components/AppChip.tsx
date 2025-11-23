import slack from "../assets/slack.png";
import notion from "../assets/notion.png";

interface AppChipProps {
  app: string;
  isActive: boolean;
  onToggle: () => void;
}

export function AppChip({ app, isActive, onToggle }: AppChipProps) {
  const iconImg = app === "Slack" ? slack : notion;

  return (
    <button onClick={onToggle} className="relative inline-flex items-center h-[37px] px-[16px] group">
      <div className="absolute inset-[-4.38%_0_-13.14%_0] left-0 right-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 117 44">
          <g filter={`url(#filter0_d_chip_${app})`} id="Rectangle 1">
            <rect
              x="4.24037"
              y="2.62019"
              width={isActive ? "108.5" : "108.24"}
              height={isActive ? "35" : "35.0"}
              rx={isActive ? "8" : "8.10066"}
              shapeRendering="crispEdges"
              stroke={isActive ? "#50C878" : "#8E8E93"}
              strokeWidth={isActive ? "2" : "0.48"}
              fill="none"
            />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="43.4807" id={`filter0_d_chip_${app}`} width="116.481" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1.62019" />
              <feGaussianBlur stdDeviation="1.62019" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_1151" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_1151" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
      <div className="relative flex items-center gap-2 z-10">
        <img src={iconImg.src} alt={app} className="size-[20px] object-contain" />
        <span className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal text-[16px] text-black whitespace-nowrap">
          {app}
        </span>
      </div>
    </button>
  );
}