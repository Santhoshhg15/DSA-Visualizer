import { create } from 'zustand';

interface State {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const useStore = create<State>((set) => ({
  darkMode: true,
  setDarkMode: (val) => set({ darkMode: val }),
}));
