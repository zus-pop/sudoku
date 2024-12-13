import { motion } from "motion/react";
import { useSudokuStore } from "../stores";

const SolvingModal = ({ handleClose }: { handleClose: () => void }) => {
  const solve = useSudokuStore((state) => state.solveBoard);

  const handleSolve = (type: "immediately" | "animation") => {
    handleClose();
    solve(type);
  };

  const solvingType: {
    type: "immediately" | "animation";
    name: string;
  }[] = [
    {
      type: "immediately",
      name: "Immediately 🤯",
    },
    {
      type: "animation",
      name: "Animation 🤩",
    },
  ];

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      onClick={(e) => e.stopPropagation()}
      transition={{ type: "spring", stiffness: 300 }}
      className="flex flex-col bg-white rounded-lg shadow-lg p-6 w-1/2"
    >
      <h2 className="text-3xl font-semibold mb-6 text-center">
        Choose Solving Type
      </h2>
      <motion.div className="flex justify-center items-center gap-4">
        {solvingType.map((type) => (
          <motion.button
            key={type.type}
            onClick={() => handleSolve(type.type)}
            className={`w-full h-36 text-3xl text-center text-white rounded bg-slate-800 hover:bg-slate-500 transition duration-300`}
          >
            {type.name}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SolvingModal;
