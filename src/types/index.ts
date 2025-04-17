// src/types/index.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  sold_out: boolean;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  product?: {
    name: string;
    price?: number;
  };
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'pending' | 'completed' | 'shipped' | 'delivered';
  created_at: string;
  items: { product_id: string; quantity: number; price: number }[];
  shipping_address: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  address?: string;
  role: 'user' | 'admin';
  password?: string; // Adicionado como opcional, já que nem todas as rotas precisam disso
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
}
