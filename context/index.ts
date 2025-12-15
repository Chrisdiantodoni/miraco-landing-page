import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Collection } from "@/lib/types/settings";

// initial state type
interface ZustandState {
  expanded: boolean;
  handle?: (
    name: keyof ZustandState,
    value: ZustandState[keyof ZustandState]
  ) => void;
  collections: Collection[];
}

// initial state
const initialState: ZustandState = {
  expanded: true,
  collections: [],
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
