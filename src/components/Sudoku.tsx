import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useSudokuStore } from "../stores";
import SolvingTypeModal from "./SolvingTypeModal";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Timer from "./Timer";
import { useTimerStore } from "../stores/TimerStore";

const sudoku = () => {
  const isTimerFinished = useTimerStore((state) => state.isFinished);
  const board = useSudokuStore((state) => state.board);
  const digits = useSudokuStore((state) => state.digits);
  const { isChecking, isSolving, isGenerating, isResetting } = useSudokuStore(
    (state) => state.processingStates
  );

  const resetTimer = useTimerStore((state) => state.resetTimer);
  const isNotFull = useSudokuStore((state) => state.isNotFull);
  const generateBoard = useSudokuStore((state) => state.generateBoard);
  const setSelectedCell = useSudokuStore((state) => state.setSelectedCell);
  const updateCell = useSudokuStore((state) => state.updateCell);
  const validate = useSudokuStore((state) => state.validateBoard);
  const resetBoard = useSudokuStore((state) => state.resetBoard);
  const setProcessingState = useSudokuStore(
    (state) => state.setProcessingState
  );

  useEffect(() => {
    console.log(isTimerFinished);
    generateBoard("medium");
  }, []);

  const actions: {
    type: string;
    name: string;
    isProcessing: boolean;
    processingName: string;
    action: () => void;
  }[] = [
    {
      type: "generate",
      name: "Generate",
      isProcessing: isGenerating,
      processingName: "Generating...",
      action: () => {
        generateBoard("easy");
        resetTimer();
      },
    },
    {
      type: "check",
      name: "Check",
      isProcessing: isChecking,
      processingName: "Checking...",
      action: () => {
        setProcessingState({ isChecking: true });
        if (validate()) {
          toast.success("Valid");
        } else {
          toast.error("Invalid");
        }
        setProcessingState({ isChecking: false });
      },
    },
    {
      type: "solve",
      name: "Solve For Me",
      isProcessing: isSolving,
      processingName: "Solving...",
      action: () => {
        setIsSolvingModalOpen(true);
      },
    },
    {
      type: "reset",
      name: "Reset",
      isProcessing: isResetting,
      processingName: "Resetting...",
      action: () => {
        resetBoard();
        resetTimer();
      },
    },
  ];

  const [isShow, setIsShow] = useState<boolean>(false);
  const [isSolvingModalOpen, setIsSolvingModalOpen] = useState<boolean>(false);

  return (
    <motion.div className="-mt-20 flex flex-col items-center">
      <motion.div className="mx-auto p-4 bg-sky-800 rounded-md">
        <motion.div className={`grid grid-cols-9`}>
          {board.map((row, rowIndex) =>
            row.map((_, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                className={`flex justify-center items-center bg-white font-medium border
                    w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
                    text-sm sm:text-lg md:text-2xl
                    ${rowIndex % 3 === 2 && rowIndex !== 8 ? "border-b-4" : ""}
                ${colIndex % 3 === 2 && colIndex !== 8 ? "border-r-4" : ""}
                w-10 h-10
                border-gray-800
                `}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <motion.input
                  whileHover={{
                    scale: 1.2,
                    backgroundColor: "#dbdbdb",
                    border: "1px solid #2563EB",
                  }}
                  whileFocus={{ scale: 1.1 }}
                  onFocus={() => setIsShow(true)}
                  onBlur={() => setIsShow(false)}
                  type="text"
                  animate={{
                    scale: 1,
                    backgroundColor:
                      board[rowIndex][colIndex] > 0 ? "#dbdbdb" : "#fff",
                  }}
                  readOnly
                  maxLength={1}
                  className="w-full h-full text-center hover:cursor-pointer focus:bg-gray-300"
                  value={
                    board[rowIndex][colIndex] > 0
                      ? board[rowIndex][colIndex]
                      : ""
                  }
                  onClick={() =>
                    setSelectedCell({ row: rowIndex, col: colIndex })
                  }
                ></motion.input>
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed flex flex-col gap-4 right-36 top-60  text-center"
      >
        {actions.map((action) => {
          const isDisabled =
            (action.type === "solve" ? !isTimerFinished : false) ||
            (action.type === "check" ? isNotFull() : false) ||
            isSolving ||
            isChecking ||
            isGenerating ||
            isResetting;
          return (
            <motion.button
              layout
              transition={{ type: "spring" }}
              disabled={isDisabled}
              type="button"
              key={action.name}
              onClick={action.action}
              whileTap={{ scale: 0.9 }}
              whileHover={{
                scale: isDisabled ? 1 : 1.1,
                backgroundColor: isDisabled ? "#ef4444" : "#075985",
              }}
              className={`px-6 py-2 flex justify-start items-center gap-2 cursor-pointer
                ${
                  !isTimerFinished && action.type === "solve"
                    ? "bg-red-500"
                    : "bg-sky-800"
                }
                disabled:opacity-50 disabled:cursor-not-allowed bg-sky-800 rounded-md text-white text-lg
                `}
            >
              {action.isProcessing && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}
              {action.type === "solve" && !isTimerFinished && (
                <span>
                  <Timer />
                </span>
              )}
              {action.isProcessing ? action.processingName : action.name}
            </motion.button>
          );
        })}
      </motion.div>
      <AnimatePresence>
        {isSolvingModalOpen && (
          <SolvingTypeModal handleClose={() => setIsSolvingModalOpen(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isShow && (
          <motion.div
            exit={{ opacity: 0, scale: 1.1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex bg-sky-800 rounded-md justify-between text-3xl md:text-4xl lg:text-5xl text-white fixed bottom-20 sm:bottom-16 md:bottom-8"
          >
            {digits.map((digit) => (
              <motion.div
                key={digit}
                onClick={() => updateCell(digit)}
                whileTap={{ scale: 0.9 }}
                whileHover={{
                  scale: 1.15,
                  backgroundColor: "#2563EB",
                  cursor: "pointer",
                }}
                className="px-4 py-2 rounded-md"
              >
                {digit}
              </motion.div>
            ))}
            <motion.div
              whileTap={{ scale: 1 }}
              onClick={() => updateCell(0)}
              whileHover={{
                scale: 1.15,
                backgroundColor: "#f01e2c",
                cursor: "pointer",
              }}
              className="px-4 py-2 rounded-md"
            >
              <span>Clear</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default sudoku;
