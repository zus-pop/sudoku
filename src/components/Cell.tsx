import { motion } from "motion/react";
import { RefObject } from "react";

const Cell = ({
  board,
  dragConstraints,
  row,
  col,
  onClick,
  onBlur,
  onFocus,
}: {
  board: number[][];
  row: number;
  col: number;
  dragConstraints: RefObject<HTMLDivElement>;
  onClick: () => void;
  onBlur: () => void;
  onFocus: () => void;
}) => {
  return (
    <motion.div
      drag
      dragConstraints={dragConstraints}
      dragSnapToOrigin
      className={`flex justify-center items-center bg-white font-medium border
                    w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
                    text-sm sm:text-lg md:text-2xl
                    ${row % 3 === 2 && row !== 8 ? "border-b-4" : ""}
                ${col % 3 === 2 && col !== 8 ? "border-r-4" : ""}
                w-10 h-10
                border-gray-800
                `}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.input
        whileHover={{
          scale: 1.2,
          backgroundColor: "#dbdbdb",
          border: "1px solid #2563EB",
        }}
        whileFocus={{ scale: 1.2 }}
        animate={{
          scale: 1,
          backgroundColor: board[row][col] > 0 ? "#dbdbdb" : "#fff",
        }}
        type="text"
        readOnly
        maxLength={1}
        className="w-full h-full text-center hover:cursor-pointer focus:bg-gray-300"
        value={board[row][col] > 0 ? board[row][col] : ""}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
      ></motion.input>
    </motion.div>
  );
};

export default Cell;
