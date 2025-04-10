import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const variants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.61, 1, 0.88, 1] } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.3, ease: [0.61, 1, 0.88, 1] } }
};

export function PageTransition({ children, className }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={variants}
      className={cn("w-full", className)}
    >
      {children}
    </motion.div>
  );
}