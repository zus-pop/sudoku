import { motion } from "motion/react";
import { useSudokuStore } from "../stores";

const SolvingTypeModal = ({ handleClose }: { handleClose(): void }) => {
  const solve = useSudokuStore((state) => state.solveBoard);

  const handleSolve = (type: "immediately" | "animation") => {
    handleClose();
    solve(type);
  };

  return (
    <motion.div
      onClick={handleClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        exit={{ y: -100 }}
        onClick={(e) => e.stopPropagation()}
        transition={{ type: "spring", stiffness: 300 }}
        className="flex flex-col bg-white rounded-lg shadow-lg p-6 w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-6 text-center">
          Choose Solving Type
        </h2>
        <motion.div className="flex justify-center items-center gap-4 *:w-full *:h-36">
          <motion.button
            onClick={() => handleSolve("immediately")}
            className="bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
          >
            Immediately 🤯
          </motion.button>
          <motion.button
            onClick={() => handleSolve("animation")}
            className="bg-green-500 text-white rounded hover:bg-green-700 transition duration-300"
          >
            Animation 🤩
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SolvingTypeModal;
