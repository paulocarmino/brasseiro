// API Client
// Começa com mock data, evolui para Supabase quando necessário

import { mockUsers, mockProducts, delay, type User, type Product } from "@/mocks/data"

// ============================================
// FASE 1: MOCK API (Atual)
// ============================================
// Use estas funções durante prototipagem
// Simulam chamadas de API com mock data

export const api = {
  users: {
    getAll: async (): Promise<User[]> => {
      await delay(500) // Simula latência de rede
      return mockUsers
    },
    getById: async (id: string): Promise<User | undefined> => {
      await delay(300)
      return mockUsers.find((user) => user.id === id)
    },
  },
  products: {
    getAll: async (): Promise<Product[]> => {
      await delay(500)
      return mockProducts
    },
    getById: async (id: string): Promise<Product | undefined> => {
      await delay(300)
      return mockProducts.find((product) => product.id === id)
    },
  },
}

// ============================================
// FASE 2: SUPABASE API (Quando necessário)
// ============================================
// Quando o usuário solicitar backend real:
// 1. Rode: npm install @supabase/supabase-js
// 2. Copie: cp templates/supabase.ts.example src/lib/supabase.ts
// 3. Configure: .env com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
// 4. Descomente o código abaixo e adapte para suas tabelas

/*
import { supabase } from './supabase'

export const api = {
  users: {
    getAll: async (): Promise<User[]> => {
      const { data, error } = await supabase
        .from('users')
        .select('*')

      if (error) throw error
      return data || []
    },
    getById: async (id: string): Promise<User | undefined> => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
  },
  products: {
    getAll: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')

      if (error) throw error
      return data || []
    },
    getById: async (id: string): Promise<Product | undefined> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
  },
}
*/
