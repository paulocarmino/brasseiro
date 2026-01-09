// Exemplo de Zustand Store
// Use este padrão para gerenciar estado global na aplicação

import { create } from "zustand"
import type { Product } from "@/mocks/data"

interface ExampleStore {
  // Estado
  products: Product[]
  isLoading: boolean
  selectedProduct: Product | null

  // Ações
  setProducts: (products: Product[]) => void
  setLoading: (loading: boolean) => void
  selectProduct: (product: Product | null) => void
  clearSelection: () => void
}

export const useExampleStore = create<ExampleStore>((set) => ({
  // Estado inicial
  products: [],
  isLoading: false,
  selectedProduct: null,

  // Ações
  setProducts: (products) => set({ products }),
  setLoading: (isLoading) => set({ isLoading }),
  selectProduct: (selectedProduct) => set({ selectedProduct }),
  clearSelection: () => set({ selectedProduct: null }),
}))

// Exemplo de uso:
// const { products, setProducts } = useExampleStore()
// const isLoading = useExampleStore((state) => state.isLoading)
