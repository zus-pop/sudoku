import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "sonner";
import { useSudokuStore, useTimerStore } from "../stores";
import BackDrop from "./BackDrop";
import Cell from "./Cell";
import GeneratingModal from "./GeneratingModal";
import SolvingModal from "./SolvingModal";
import Timer from "./Timer";

const sudoku = () => {
  const [tempCell, setTempCell] = useState<{ row: number; col: number } | null>(
    null
  );
  const constraintRef = useRef(null);
  const isTimerFinished = useTimerStore((state) => state.isFinished);
  const board = useSudokuStore((state) => state.board);
  const initialBoard = useSudokuStore((state) => state.initialBoard);
  const digits = useSudokuStore((state) => state.digits);
  const { isChecking, isSolving, isGenerating, isResetting } = useSudokuStore(
    (state) => state.processingStates
  );
  const currentLevel = useSudokuStore((state) => state.currentLevel);

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
    const levels = ["easy", "medium", "hard", "extreme"];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)] as
      | "easy"
      | "medium"
      | "hard"
      | "extreme";
    generateBoard(randomLevel);
  }, []);

  const actions: {
    type: "generate" | "check" | "solve" | "reset";
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
        setIsGeneratingModalOpen(true);
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

  const [isDigitsShow, setIsDigitsShow] = useState<boolean>(false);
  const [isSolvingModalOpen, setIsSolvingModalOpen] = useState<boolean>(false);
  const [isGeneratingModalOpen, setIsGeneratingModalOpen] =
    useState<boolean>(false);

  return (
    <motion.div
      ref={constraintRef}
      className="-mt-20 flex flex-col items-center gap-2"
    >
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="text-3xl font-bold text-white mb-2"
      >
        Sudoku - {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}
      </motion.h1>
      <motion.div className="mx-auto p-4 bg-sky-800 rounded-md">
        <motion.div className={`grid grid-cols-9`}>
          {board.map((row, rowIndex) =>
            row.map((_, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                dragConstraints={constraintRef}
                board={board}
                initialBoard={initialBoard}
                selectedCell={tempCell}
                row={rowIndex}
                col={colIndex}
                onClick={() => {
                  setSelectedCell({ row: rowIndex, col: colIndex });
                  setTempCell({ row: rowIndex, col: colIndex });
                }}
                onFocus={() => setIsDigitsShow(true)}
                onBlur={() => {
                  setIsDigitsShow(false);
                  setTempCell(null);
                }}
              />
            ))
          )}
        </motion.div>
      </motion.div>
      <motion.div
        layout
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="fixed flex md:flex-col gap-4 right-10 bottom-5 sm:text-sm sm:right-10 sm:bottom-5 md:right-10 md:top-48 lg:right-20 lg:top-52"
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
              className={`relative w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-2 text-lg sm:text-2xl md:text-3xl flex justify-start items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-sky-800 rounded-md text-white`}
            >
              {action.isProcessing && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}
              {action.type === "solve" && !isTimerFinished && <Timer />}
              {action.isProcessing ? action.processingName : action.name}
            </motion.button>
          );
        })}
      </motion.div>
      <AnimatePresence>
        {isSolvingModalOpen && (
          <BackDrop handleClose={() => setIsSolvingModalOpen(false)}>
            <SolvingModal handleClose={() => setIsSolvingModalOpen(false)} />
          </BackDrop>
        )}
        {isGeneratingModalOpen && (
          <BackDrop handleClose={() => setIsGeneratingModalOpen(false)}>
            <GeneratingModal
              handleClose={() => setIsGeneratingModalOpen(false)}
            />
          </BackDrop>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isDigitsShow && (
          <motion.div
            exit={{ opacity: 0, scale: 1.1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex bg-sky-800 rounded-md justify-between text-2xl md:text-3xl lg:text-4xl text-white fixed bottom-20 sm:bottom-16 md:bottom-8"
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
