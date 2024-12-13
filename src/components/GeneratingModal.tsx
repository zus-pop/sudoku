import { motion } from "motion/react";
import { useSudokuStore, useTimerStore } from "../stores";

const GeneratingModal = ({ handleClose }: { handleClose: () => void }) => {
  const generateBoard = useSudokuStore((state) => state.generateBoard);
  const resetTimer = useTimerStore((state) => state.resetTimer);

  const handleGenerate = (type: "easy" | "medium" | "hard" | "extreme") => {
    handleClose();
    generateBoard(type);
    resetTimer();
  };

  const solvingType: {
    type: "easy" | "medium" | "hard" | "extreme";
    name: string;
  }[] = [
    {
      type: "easy",
      name: "Easy 😊",
    },
    {
      type: "medium",
      name: "Medium 😎",
    },
    {
      type: "hard",
      name: "Hard 😤",
    },
    {
      type: "extreme",
      name: "Extreme 🤯",
    },
  ];

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      onClick={(e) => e.stopPropagation()}
      transition={{ type: "spring", stiffness: 300 }}
      className="flex flex-col bg-white rounded-lg shadow-lg p-6 w-2/3"
    >
      <h2 className="text-3xl font-semibold mb-6 text-center">
        Choose Sudoku Level
      </h2>
      <motion.div className="flex justify-center items-center gap-4">
        {solvingType.map((type) => (
          <motion.button
            key={type.type}
            onClick={() => handleGenerate(type.type)}
            className={`w-full h-36 text-3xl text-center text-white rounded bg-slate-800 hover:bg-slate-500 transition duration-300`}
          >
            {type.name}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default GeneratingModal;
