
export interface Product {
  id: string;
  name: string;
  category: string;
  costPrice: number; // Precio al que compraste
  price: number;     // Precio al que vendes
  stock: number;
  minStockThreshold: number;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  totalProfit: number; // Ganancia real de esta venta
  date: string;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  SALES = 'SALES',
  AI_INSIGHTS = 'AI_INSIGHTS'
}
