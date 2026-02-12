
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStockThreshold: number;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  date: string;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  SALES = 'SALES',
  AI_INSIGHTS = 'AI_INSIGHTS'
}
