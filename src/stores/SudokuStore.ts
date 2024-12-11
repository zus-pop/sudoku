import { create } from "zustand";

interface Cell {
  row: number;
  col: number;
}

interface Tracker {
  rowTracker: number[];
  colTracker: number[];
  boxTracker: number[];
}

interface SudokuState {
  size: number;
  digits: number[];
  initialBoard: number[][];
  board: number[][];
  selectedCell: Cell | null;
  setBoard: (board: number[][]) => void;
  setBoardAnimation: (board: number[][]) => Promise<void>;
  setSelectedCell: (cell: Cell | null) => void;
  updateCell: (value: number) => void;
  validateBoard: () => boolean;
  getCurrentState: (board: number[][]) => Tracker;
  resetBoard: () => void;
  getBoxIndex: (row: number, col: number) => number;
  isValid: (row: number, col: number, value: number, state: Tracker) => boolean;
  solveBoard: (type: "immediately" | "animation") => void;
  solve: (
    board: number[][],
    row: number,
    col: number,
    state: Tracker
  ) => boolean;
  solveAnimation: (
    board: number[][],
    row: number,
    col: number,
    state: Tracker
  ) => Promise<boolean>;
}

export const useSudokuStore = create<SudokuState>()((set, get) => ({
  size: 9,
  lastRender: 0,
  //   board: Array.from({ length: 9 }, () =>
  //     Array.from({ length: 9 }, () =>
  //       Math.random() > 0.7 ? Math.floor(Math.random() * 9) + 1 : 0
  //     )
  //   ),
  initialBoard: [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ],
  board: [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ],
  digits: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  selectedCell: null,

  setSelectedCell: (selectedCell) => set({ selectedCell }),

  updateCell: (value) =>
    set((state) => {
      if (!state.selectedCell) return state;
      const { row, col } = state.selectedCell;
      const updatedBoard = [...state.board];
      updatedBoard[row][col] = value;
      return { board: updatedBoard };
    }),

  validateBoard: () => {
    const rowTracker: number[] = Array.from({ length: 9 }, () => 0);
    const colTracker: number[] = Array.from({ length: 9 }, () => 0);
    const boxTracker: number[] = Array.from({ length: 9 }, () => 0);
    const board = get().board;

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const value = board[row][col];
        if (value === 0) continue;
        const pos = 1 << (value - 1);

        if ((rowTracker[row] & pos) > 0) return false;
        rowTracker[row] |= pos;

        if ((colTracker[col] & pos) > 0) return false;
        colTracker[col] |= pos;

        const boxIndex = get().getBoxIndex(row, col);
        if ((boxTracker[boxIndex] & pos) > 0) return false;
        boxTracker[boxIndex] |= pos;
      }
    }
    return true;
  },


  resetBoard: () =>
    set((state) => ({
      board: JSON.parse(JSON.stringify(state.initialBoard)) as number[][],
    })),

  getCurrentState: (board: number[][]): Tracker => {
    const size = get().size;
    const rowTracker: number[] = Array.from({ length: size }, () => 0);
    const colTracker: number[] = Array.from({ length: size }, () => 0);
    const boxTracker: number[] = Array.from({ length: size }, () => 0);

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === 0) continue;

        const value = board[row][col];
        const pos = 1 << (value - 1);
        const boxIndex = get().getBoxIndex(row, col);

        rowTracker[row] |= pos;

        colTracker[col] |= pos;

        boxTracker[boxIndex] |= pos;
      }
    }

    return {
      rowTracker,
      colTracker,
      boxTracker,
    };
  },

  getBoxIndex: (row, col) => Math.floor(row / 3) * 3 + Math.floor(col / 3),

  isValid: (row, col, value, tracker) => {
    const pos = 1 << (value - 1);
    const boxIndex = get().getBoxIndex(row, col);
    const { rowTracker, colTracker, boxTracker } = tracker;

    return (
      (rowTracker[row] & pos) === 0 &&
      (colTracker[col] & pos) === 0 &&
      (boxTracker[boxIndex] & pos) === 0
    );
  },

  setBoard: (board: number[][]) => set({ board }),
  
  setBoardAnimation: async (board: number[][]) => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    set({ board: [...board] });
  },

  solveBoard: async (type) => {
    const board = JSON.parse(JSON.stringify(get().initialBoard)) as number[][];
    const state = get().getCurrentState(board);
    switch (type) {
      case "immediately":
        get().solve(board, 0, 0, state);
        break;
      case "animation":
        await get().solveAnimation(board, 0, 0, state);
        alert("Solved!");
        break;
      default:
        break;
    }
  },

  solveAnimation: async (board, row, col, state) => {
    const digits = get().digits;
    const size = get().size;
    const { rowTracker, colTracker, boxTracker } = state;

    if (row === size) return true;

    if (col === size) return get().solveAnimation(board, row + 1, 0, state);

    if (board[row][col] !== 0)
      return get().solveAnimation(board, row, col + 1, state);

    for (let digit of digits) {
      if (get().isValid(row, col, digit, state)) {
        const pos = 1 << (digit - 1);
        const boxIndex = get().getBoxIndex(row, col);

        board[row][col] = digit;
        rowTracker[row] |= pos;
        colTracker[col] |= pos;
        boxTracker[boxIndex] |= pos;
        await get().setBoardAnimation(board);

        if (await get().solveAnimation(board, row, col + 1, state)) return true;

        board[row][col] = 0;
        rowTracker[row] &= ~pos;
        colTracker[col] &= ~pos;
        boxTracker[boxIndex] &= ~pos;
        await get().setBoardAnimation(board);
      }
    }
    return false;
  },
  
  solve: (board, row, col, state) => {
    const digits = get().digits;
    const size = get().size;
    const { rowTracker, colTracker, boxTracker } = state;

    if (row === size) return true;

    if (col === size) return get().solve(board, row + 1, 0, state);

    if (board[row][col] !== 0) return get().solve(board, row, col + 1, state);

    for (let digit of digits) {
      if (get().isValid(row, col, digit, state)) {
        const pos = 1 << (digit - 1);
        const boxIndex = get().getBoxIndex(row, col);

        board[row][col] = digit;
        rowTracker[row] |= pos;
        colTracker[col] |= pos;
        boxTracker[boxIndex] |= pos;
        set({ board });

        if (get().solve(board, row, col + 1, state)) return true;

        board[row][col] = 0;
        rowTracker[row] &= ~pos;
        colTracker[col] &= ~pos;
        boxTracker[boxIndex] &= ~pos;
        set({ board });
      }
    }
    return false;
  },
}));
