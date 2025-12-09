import { create } from "zustand";
import { persist } from "zustand/middleware";

// initial state type
interface ZustandState {
  expanded: boolean;
  handle?: (
    name: keyof ZustandState,
    value: ZustandState[keyof ZustandState]
  ) => void;
}

// initial state
const initialState: ZustandState = {
  expanded: true,
};

// Make zustand state more concise and clear
const createStore = create<ZustandState>((set) => ({
  ...initialState,
  handle: (name, value) =>
    set((state) => ({
      ...state,
      [name]: value,
    })),
}));

export default createStore;
