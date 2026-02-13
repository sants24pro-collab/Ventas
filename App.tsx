
import React, { useState, useEffect } from 'react';
import { Product, Sale, View } from './types.ts';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import Inventory from './components/Inventory.tsx';
import Sales from './components/Sales.tsx';
import AIInsights from './components/AIInsights.tsx';

// Llave maestra para persistencia permanente
const MASTER_KEY_PRODUCTS = 'ELITE_STOCK_MASTER_PRODUCTS';
const MASTER_KEY_SALES = 'ELITE_STOCK_MASTER_SALES';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.DASHBOARD);
  
  // Lógica de inicialización con migración de datos de versiones anteriores
  const [products, setProducts] = useState<Product[]>(() => {
    const current = localStorage.getItem(MASTER_KEY_PRODUCTS);
    if (current) return JSON.parse(current);
    
    // Si no hay en la maestra, buscar en versiones previas
    const legacy = localStorage.getItem('sm_v3_products') || 
                   localStorage.getItem('sm_v2_products') || 
                   localStorage.getItem('sm_v1_products');
    return legacy ? JSON.parse(legacy) : [];
  });
  
  const [sales, setSales] = useState<Sale[]>(() => {
    const current = localStorage.getItem(MASTER_KEY_SALES);
    if (current) return JSON.parse(current);
    
    const legacy = localStorage.getItem('sm_v3_sales') || 
                   localStorage.getItem('sm_v2_sales') || 
                   localStorage.getItem('sm_v1_sales');
    return legacy ? JSON.parse(legacy) : [];
  });

  // Guardado automático cada vez que cambien los datos
  useEffect(() => {
    localStorage.setItem(MASTER_KEY_PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(MASTER_KEY_SALES, JSON.stringify(sales));
  }, [sales]);

  const addProduct = (product: Product) => setProducts(prev => [product, ...prev]);
  const updateProduct = (updated: Product) => setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  const handleSale = (sale: Sale) => {
    const product = products.find(p => p.id === sale.productId);
    if (product && product.stock >= sale.quantity) {
      updateProduct({ ...product, stock: product.stock - sale.quantity });
      setSales(prev => [sale, ...prev]);
    }
  };

  const exportInventoryToCSV = () => {
    if (products.length === 0) {
      alert("No hay productos en el inventario para exportar.");
      return;
    }

    // Cabeceras detalladas para Excel
    const headers = [
      "ID", 
      "Nombre de Producto", 
      "Categoria", 
      "Costo de Compra ($)", 
      "Precio de Venta ($)", 
      "Ganancia por Unidad ($)", 
      "Margen de Ganancia (%)", 
      "Stock Disponible", 
      "Umbral de Alerta"
    ];

    const rows = products.map(p => {
      const profit = p.price - p.costPrice;
      const margin = p.costPrice > 0 ? ((profit / p.price) * 100).toFixed(2) : "100";
      return [
        p.id,
        p.name,
        p.category,
        p.costPrice.toFixed(2),
        p.price.toFixed(2),
        profit.toFixed(2),
        `${margin}%`,
        p.stock,
        p.minStockThreshold
      ];
    });

    // Crear contenido CSV con BOM para soporte de tildes en Excel
    let csvContent = "\uFEFF" + headers.join(",") + "\n";
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Inventario_Elite_Store_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    switch (view) {
      case View.DASHBOARD: return <Dashboard products={products} sales={sales} />;
      case View.INVENTORY: return <Inventory products={products} onAdd={addProduct} onUpdate={updateProduct} onDelete={deleteProduct} />;
      case View.SALES: return <Sales products={products} sales={sales} onSale={handleSale} />;
      case View.AI_INSIGHTS: return <AIInsights products={products} sales={sales} />;
      default: return <Dashboard products={products} sales={sales} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F8F5F2] overflow-hidden">
      <Sidebar currentView={view} setView={setView} onExport={exportInventoryToCSV} />
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar">
        <div className="p-6 md:p-12 max-w-7xl mx-auto min-h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
