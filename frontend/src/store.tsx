// store.ts
// @ts-nocheck
import { create } from 'zustand'

interface State {
  product: Product | null;
  setProduct: (product: Product) => void;
}

export const useStore = create<State>((set) => ({
  product: null,
  setProduct: (product) => set(() => ({ product })),
}))
