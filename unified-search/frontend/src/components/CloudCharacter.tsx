import { motion } from "framer-motion";
import cloudhandless from "../assets/cloudhandless.png";
import hand from "../assets/hand.png";
export function CloudCharacter() {
  return (
    <div className="absolute right-[64px] bottom-[50px]">
      <div className="relative w-[128px] h-[121px]">
        {/* Animated right hand (behind cloud) */}
        <motion.img
          src={hand.src}
          alt="Cloud Hand"
          className="absolute w-[19px] h-[39px] left-[112px] top-[10px] object-contain z-0"
          animate={{
            rotate: [0, 20, -20, 0],
            x: [0, 3, -3, 0] // smaller movement to keep attached
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          }}
        />
        {/* Cloud body stays in front */}
        <img src={cloudhandless.src} alt="Cloud Character" className="absolute left-0 top-0 w-[128px] h-[121px] object-contain z-10" />
      </div>
    </div>
  );
}