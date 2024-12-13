import { toast } from "sonner";
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

interface SudokuLevel {
  easy: number;
  medium: number;
  hard: number;
  extreme: number;
}

interface ProcessState {
  isSolving: boolean;
  isGenerating: boolean;
  isChecking: boolean;
  isResetting: boolean;
}

interface SudokuState {
  speed: number;
  digits: number[];
  size: number;
  initialBoard: number[][];
  board: number[][];
  levels: SudokuLevel;
  selectedCell: Cell | null;
  processingStates: ProcessState;
  currentLevel: "easy" | "medium" | "hard" | "extreme";

  isNotFull: () => boolean;
  generateBoard: (level: "easy" | "medium" | "hard" | "extreme") => void;
  fillBoard: (
    board: number[][],
    row: number,
    col: number,
    state: Tracker
  ) => void;
  removeDigits: (board: number[][], level: number) => number[][];
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
  setProcessingState: (state: Partial<ProcessState>) => void;
  setCurrentLevel: (level: "easy" | "medium" | "hard" | "extreme") => void;
  setSpeed: (speed: number) => void;
}

export const useSudokuStore = create<SudokuState>()((set, get) => ({
  speed: 30,
  digits: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  size: 9,
  initialBoard: Array.from({ length: 9 }, () => Array(9).fill(0)),
  board: Array.from({ length: 9 }, () => Array(9).fill(0)),
  levels: {
    easy: 45,
    medium: 35,
    hard: 25,
    extreme: 15,
  },
  selectedCell: null,
  processingStates: {
    isSolving: false,
    isGenerating: false,
    isChecking: false,
    isResetting: false,
  },
  currentLevel: "medium",

  isNotFull: () => {
    const board = get().board;
    return board.some((row) => row.some((cell) => cell === 0));
  },
  setProcessingState: (processingStates) =>
    set((state) => ({
      processingStates: { ...state.processingStates, ...processingStates },
    })),

  generateBoard: (level = "medium") => {
    get().setProcessingState({ isGenerating: true });
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    const state = get().getCurrentState(board);

    for (let rowCol = 0; rowCol < 9; rowCol += 3) {
      get().fillBoard(board, rowCol, rowCol, state);
    }
    get().solve(board, 0, 0, state);

    const levelSize = get().levels[level];

    const newBoard = get().removeDigits(board, levelSize);
    set({
      board: JSON.parse(JSON.stringify(newBoard)) as number[][],
      initialBoard: JSON.parse(JSON.stringify(newBoard)) as number[][],
    });
    get().setProcessingState({ isGenerating: false });
    get().setCurrentLevel(level);
  },

  fillBoard: (board, row, col, state) => {
    const digits = [...get().digits];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let value: number;
        do {
          const index = Math.floor(Math.random() * digits.length);
          value = digits[index];
          digits.splice(index, 1);
        } while (!get().isValid(row + i, col + j, value, state));

        board[row + i][col + j] = value;

        const pos = 1 << (value - 1);
        const boxIndex = get().getBoxIndex(row + i, col + j);
        state.rowTracker[row + i] |= pos;
        state.colTracker[col + j] |= pos;
        state.boxTracker[boxIndex] |= pos;
      }
    }
  },

  removeDigits: (board, level) => {
    board = JSON.parse(JSON.stringify(board)) as number[][];
    const cells = Array.from({ length: 81 }, (_, i) => ({
      row: Math.floor(i / 9),
      col: i % 9,
    }));

    while (cells.length > level) {
      const index = Math.floor(Math.random() * cells.length);
      const { row, col } = cells[index];
      cells.splice(index, 1);
      board[row][col] = 0;
    }

    return board;
  },

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

  resetBoard: () => {
    get().setProcessingState({ isResetting: true });
    set((state) => ({
      board: JSON.parse(JSON.stringify(state.initialBoard)) as number[][],
    }));
    get().setProcessingState({ isResetting: false });
  },

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

  setBoard: (board: number[][]) => set({ board: [...board] }),

  setBoardAnimation: async (board: number[][]) => {
    await new Promise((resolve) => setTimeout(resolve, get().speed));
    set({ board: [...board] });
  },

  solveBoard: async (type) => {
    const board = JSON.parse(JSON.stringify(get().initialBoard)) as number[][];
    const state = get().getCurrentState(board);
    get().setProcessingState({ isSolving: true });

    switch (type) {
      case "immediately":
        get().solve(board, 0, 0, state);
        break;
      case "animation":
        await get().solveAnimation(board, 0, 0, state);
        break;
      default:
        break;
    }
    toast.success("Solved the board!");
    get().setProcessingState({ isSolving: false });
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

  setCurrentLevel: (level) => set({ currentLevel: level }),
  setSpeed: (speed) => set({ speed }),
}));
