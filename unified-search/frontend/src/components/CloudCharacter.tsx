import { motion } from "framer-motion";
import { Cloud } from "lucide-react";

export function CloudCharacter() {
  return (
    <div className="absolute right-[64px] bottom-[50px]">
      <motion.div
        className="relative w-32 h-32"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut"
        }}
      >
        <Cloud className="size-full text-[#5581FF]" />
      </motion.div>
    </div>
  );
}