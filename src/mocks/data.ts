// Mock data para prototipagem
// Use este arquivo para criar dados de exemplo durante o desenvolvimento

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  image?: string
}

// Exemplo de usuários mock
export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
]

// Exemplo de produtos mock
export const mockProducts: Product[] = [
  {
    id: "1",
    title: "Product 1",
    description: "This is an example product description",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
  },
  {
    id: "2",
    title: "Product 2",
    description: "Another example product with different features",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
  },
  {
    id: "3",
    title: "Product 3",
    description: "Premium product with advanced capabilities",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
  },
]

// Simula delay de API
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
