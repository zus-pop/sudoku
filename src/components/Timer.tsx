import { useEffect } from "react";
import { useTimerStore } from "../stores/TimerStore";
import { motion } from "motion/react";

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
    <motion.div
      transition={{
        type: "spring",
      }}
      className=""
    >
      {timer}
    </motion.div>
  );
};

export default Timer;
