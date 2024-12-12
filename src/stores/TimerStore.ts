import { create } from "zustand";

interface TimePart {
  minutes: number;
  seconds: number;
}

interface TimerState {
  resetTimes: number;
  times: number;
  timer: string;
  isReset: boolean;
  isRunning: boolean;
  isPaused: boolean;
  isFinished: boolean;
  intervalId: number | null;

  clearTimer: () => void;
  setTimer: (id: number) => void;
  startTimer: () => void;
  setTimes: (times: number) => void;
  setResetTimes: (times: number) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  formatTime: (times: number) => string;
  countdown: () => void;
  getTimePart: (times: number) => TimePart;
}

export const useTimerStore = create<TimerState>()((set, get) => ({
  resetTimes: 60 * 5,
  times: 60 * 5,
  timer: "00:00",

  isReset: false,
  isRunning: false,
  isPaused: false,
  isFinished: false,
  intervalId: null,

  clearTimer: () => {
    const intervalId = get().intervalId;
    if (intervalId) {
      clearInterval(intervalId);
      set({ intervalId: null });
    }
  },
  setTimer(id) {
    set({ intervalId: id });
  },
  startTimer: () => {
    get().clearTimer();
    set({ isRunning: true });
    get().countdown();
  },

  countdown() {
    const id = setInterval(() => {
      const times = get().times;
      const { minutes, seconds } = get().getTimePart(times);

      if (seconds === 0 && minutes === 0) {
        set({ isFinished: true });
        set({ isRunning: false });

        set({
          timer: get().formatTime(times),
        });
        get().clearTimer();
        return;
      }
      get().setTimes(times - 1);
      set({
        timer: get().formatTime(times),
      });
    }, 1000);
    get().setTimer(id);
  },
  getTimePart(times) {
    const minutes = Math.floor(times / 60);
    const seconds = Math.floor(times % 60);
    return { minutes, seconds };
  },

  formatTime: (times) => {
    const { minutes, seconds } = get().getTimePart(times);
    return (
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0")
    );
  },

  setTimes: (times) => set({ times: times }),

  pauseTimer: () => set({ isPaused: true }),

  setResetTimes: (times) => set({ resetTimes: times }),

  resetTimer: () => {
    get().clearTimer();
    set((state) => ({
      isRunning: false,
      isPaused: false,
      isFinished: false,
      isReset: !state.isReset,
      times: get().resetTimes,
    }));
  },
}));
