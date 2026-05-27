import { create } from "zustand";
import { Collection, SiteData, SiteSettings } from "@/lib/types/settings";

// initial state type
interface ZustandState {
  expanded: boolean;
  isLoadingPage: boolean;
  handle?: (
    name: keyof ZustandState,
    value: ZustandState[keyof ZustandState]
  ) => void;
  site_settings: SiteSettings;
  collections: Collection[];
}

// initial state
const initialState: ZustandState = {
  expanded: true,
  isLoadingPage: true,
  site_settings: {
    email_contacts: "",
    phone_contacts: "",
    logo_white: "",
    logo_dark: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
    logo_white_url: "",
    logo_dark_url: "",
  },
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
