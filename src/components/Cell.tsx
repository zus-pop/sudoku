import { motion } from "motion/react";
import { RefObject } from "react";

const Cell = ({
  board,
  initialBoard,
  selectedCell,
  dragConstraints,
  row,
  col,
  onClick,
  onBlur,
  onFocus,
}: {
  board: number[][];
  initialBoard: number[][];
  selectedCell: { row: number; col: number } | null;
  row: number;
  col: number;
  dragConstraints: RefObject<HTMLDivElement>;
  onClick: () => void;
  onBlur: () => void;
  onFocus: () => void;
}) => {
  const isSelectedCell =
    !!selectedCell && selectedCell.row === row && selectedCell.col === col;

  const isRelatedRow = !!selectedCell && selectedCell.row === row;
  const isRelatedCol = !!selectedCell && selectedCell.col === col;
  const isRelatedBox =
    !!selectedCell &&
    Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
    Math.floor(selectedCell.col / 3) === Math.floor(col / 3);
  const hasSameValue =
    !!selectedCell &&
    board[selectedCell.row][selectedCell.col] > 0 &&
    board[selectedCell.row][selectedCell.col] === board[row][col];

  const isInitial = initialBoard[row][col] > 0;
  let bgColor = "bg-white";

  if (isSelectedCell) {
    bgColor = "bg-gray-500";
  } else if (hasSameValue) {
    bgColor = "bg-sky-300";
  } else if (isRelatedRow || isRelatedCol || isRelatedBox) {
    bgColor = "bg-gray-400";
  }
  return (
    <motion.div
      drag
      dragConstraints={dragConstraints}
      dragSnapToOrigin
      className={`flex justify-center items-center font-medium border
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
          border: "1px solid #2563EB",
        }}
        whileFocus={{
          scale: 1.2,
          border: "1px solid #2563EB",
        }}
        animate={{
          scale: 1,
        }}
        type="text"
        readOnly
        maxLength={1}
        className={`w-full h-full text-center ${
          initialBoard[row][col] > 0 ? "cursor-not-allowed" : "cursor-pointer"
        } ${bgColor} hover:bg-gray-400 `}
        value={board[row][col] > 0 ? board[row][col] : ""}
        onFocus={isInitial ? () => {} : onFocus}
        onBlur={onBlur}
        onClick={onClick}
      ></motion.input>
    </motion.div>
  );
};

export default Cell;
