// store.ts
// @ts-nocheck
import { create } from 'zustand'

interface State {
  dropshipping: Product | null;
  setDropshipping: (dropshipping: Product) => void;
}

export const dropStore = create<State>((set) => ({
  dropshipping: null,
  setDropshipping: (dropshipping) => set(() => ({ dropshipping })),
}))
