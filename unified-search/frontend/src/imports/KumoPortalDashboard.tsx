import svgPaths from "./svg-uaaufoo38k";
import imgImage3 from "figma:asset/c83971c90bff75db17f07aa1d9f05cd71d6ca2b0.png";
import imgImage4 from "figma:asset/54bfd4a3d4588e15cd90e5ddc6efe79fa7b9c9f2.png";

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[30px]" data-name="image 3">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage3.src} />
      </div>
      <div className="[grid-area:1_/_1] flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal justify-center leading-[0] ml-[46px] mt-[14.5px] relative text-[16px] text-black translate-y-[-50%] w-[379px]">
        <p className="leading-[normal]">@tracyla I think the cmd-f signage looks cool!</p>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[30px]" data-name="image 3">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage3.src} />
      </div>
      <div className="[grid-area:1_/_1] flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal justify-center leading-[0] ml-[46px] mt-[14.5px] relative text-[16px] text-black translate-y-[-50%] w-[631px]">
        <p className="leading-[normal]">@kashish I need the nwHacks signage by Monday evening since I need to get...</p>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[30px]" data-name="image 4">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage4.src} />
      </div>
      <div className="[grid-area:1_/_1] flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal justify-center leading-[0] ml-[46px] mt-[14.5px] relative text-[16px] text-black translate-y-[-50%] w-[431px]">
        <p className="leading-[normal]">@karenag uploaded nwHacks signage on Wed 20/12.</p>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[30px]" data-name="image 4">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage4.src} />
      </div>
      <div className="[grid-area:1_/_1] flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal justify-center leading-[0] ml-[46px] mt-[14.5px] relative text-[16px] text-black translate-y-[-50%] w-[431px]">
        <p className="leading-[normal]">@karenag edited nwHacks signage on Wed 20/12.</p>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[30px]" data-name="image 4">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage4.src} />
      </div>
      <div className="[grid-area:1_/_1] flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal justify-center leading-[0] ml-[46px] mt-[14.5px] relative text-[16px] text-black translate-y-[-50%] w-[431px]">
        <p className="leading-[normal]">@daksh created cmd-f signage on Mon 18/12.</p>
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[30px]" data-name="image 4">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage4.src} />
      </div>
      <div className="[grid-area:1_/_1] flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal justify-center leading-[0] ml-[46px] mt-[14.5px] relative text-[16px] text-black translate-y-[-50%] w-[431px]">
        <p className="leading-[normal]">@daksh created nwHacks signage on Mon 18/12.</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[28px] items-start leading-[0] left-[32px] top-[36px] w-[760px]">
      <Group />
      <Group1 />
      <Group2 />
      <Group3 />
      <Group4 />
      <Group5 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bg-[#faf9f6] h-[396px] left-[224px] rounded-[20px] top-[218px] w-[823px]">
      <div aria-hidden="true" className="absolute border-4 border-[#051b78] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <Frame />
    </div>
  );
}

function Group6() {
  return (
    <div className="relative shrink-0 size-[24.02px]">
      <div className="absolute inset-[-5.71%_-11.43%_-17.14%_-11.43%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
          <g id="Group 75">
            <g filter="url(#filter0_d_1_1457)" id="Rectangle 1">
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
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="29.5098" id="filter0_d_1_1457" width="29.5098" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1.37255" />
              <feGaussianBlur stdDeviation="1.37255" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_1457" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_1457" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function AddButton() {
  return (
    <div className="content-stretch flex gap-[3px] items-center justify-end relative shrink-0" data-name="add button">
      <p className="font-['Hanken_Grotesk:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#3d3d3d] text-[17.157px] text-nowrap whitespace-pre">enter</p>
      <Group6 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[356.5px] top-[67px] w-[558.52px]">
      <p className="font-['Instrument_Serif:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[40px] text-[rgba(60,60,67,0.6)] text-nowrap whitespace-pre">prompt here</p>
      <AddButton />
    </div>
  );
}

export default function KumoPortalDashboard() {
  return (
    <div className="bg-[#faf9f6] relative size-full" data-name="kumo portal - dashboard">
      <Frame1 />
      <div className="absolute h-0 left-[356px] top-[125.5px] w-[567.5px]" data-name="line">
        <div className="absolute inset-[-4px_-1.06%_-8px_-1.06%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 580 12">
            <g filter="url(#filter0_d_1_1023)" id="line">
              <path d="M6 4H573.5" stroke="var(--stroke-0, #051B78)" strokeLinecap="round" strokeWidth="4" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="12" id="filter0_d_1_1023" width="579.5" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="2" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_1023" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_1023" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <Frame2 />
    </div>
  );
}