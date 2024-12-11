import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useSudokuStore } from "../stores";

const sudoku = () => {
  const board = useSudokuStore((state) => state.board);
  const digits = useSudokuStore((state) => state.digits);
  const setSelectedCell = useSudokuStore((state) => state.setSelectedCell);
  const updateCell = useSudokuStore((state) => state.updateCell);
  const validate = useSudokuStore((state) => state.validateBoard);
  const resetBoard = useSudokuStore((state) => state.resetBoard);

  const solve = useSudokuStore((state) => state.solveBoard);

  const actions: {
    name: string;
    action: () => void;
  }[] = [
    {
      name: "Check",
      action: () => {
        console.log(validate());
      },
    },
    {
      name: "Solve For Me",
      action: () => {
        const type = prompt(
          "Do you want to solve it immediately or with animation?"
        );
        solve(type === "animation" ? "animation" : "immediately");
      },
    },
    {
      name: "Reset",
      action: resetBoard,
    },
  ];

  const [isShow, setIsShow] = useState<boolean>(false);

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
        className="fixed flex flex-col gap-4 right-36 top-60 text-center"
      >
        {actions.map((action) => (
          <motion.div
            key={action.name}
            onClick={action.action}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1, backgroundColor: "#2563EB" }}
            className="p-2 cursor-pointer bg-sky-800 rounded-md text-white text-lg"
          >
            {action.name}
          </motion.div>
        ))}
      </motion.div>
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
