// Custom Hook Example
// Encapsula lógica de fetching e estado

import { useEffect } from "react"
import { api } from "@/lib/api"
import { useExampleStore } from "@/stores/exampleStore"

export function useProducts() {
  const { products, isLoading, setProducts, setLoading } = useExampleStore()

  useEffect(() => {
    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await api.products.getAll()
      setProducts(data)
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  return {
    products,
    isLoading,
    refresh: loadProducts,
  }
}
