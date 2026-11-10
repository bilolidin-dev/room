"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export default function Loader({ visible }: { visible: boolean }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="loader-failsafe fixed inset-0 z-[100] flex flex-col items-center justify-center bg-night text-paper"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: reduce ? 0.2 : 1.1, ease: [0.22, 1, 0.36, 1] } }}
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, letterSpacing: "0.7em" }}
            animate={{ opacity: 1, letterSpacing: "0.42em" }}
            transition={{ duration: reduce ? 0 : 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="wordmark pl-[0.42em] text-2xl sm:text-3xl"
          >
            Hermitage
          </motion.div>
          <div className="mt-6 h-px w-28 overflow-hidden bg-paper/15">
            <motion.div
              className="h-full origin-left bg-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: reduce ? 0 : 1.4, ease: [0.65, 0, 0.35, 1] }}
            />
          </div>
          <p className="eyebrow mt-6 text-paper/45">Дизайн интерьера</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
