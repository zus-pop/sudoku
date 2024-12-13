import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useTimerStore } from "../stores";

const Timer = () => {
  const timer = useTimerStore((state) => state.timer);
  const isReset = useTimerStore((state) => state.isReset);

  const startTimer = useTimerStore((state) => state.startTimer);
  const clearTimer = useTimerStore((state) => state.clearTimer);

  useEffect(() => {
    startTimer();
    return () => clearTimer();
  }, [isReset]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ opacity: 0 }}
        className="absolute w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-85 text-black rounded-md"
      >
        <motion.div className="font-bold text-2xl text-slate-900">
          {timer}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Timer;
