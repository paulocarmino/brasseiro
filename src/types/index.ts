// Global TypeScript types
// Centralize shared types here

export * from "@/mocks/data"

// Exemplo de tipos adicionais
export interface ApiResponse<T> {
  data: T
  error?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  totalPages: number
  totalItems: number
}
