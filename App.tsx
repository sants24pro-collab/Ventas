
import React, { useState, useEffect } from 'react';
import { Product, Sale, View } from './types.ts';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import Inventory from './components/Inventory.tsx';
import Sales from './components/Sales.tsx';
import AIInsights from './components/AIInsights.tsx';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.DASHBOARD);
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('sm_v3_products');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('sm_v3_sales');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sm_v3_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sm_v3_sales', JSON.stringify(sales));
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
      alert("No hay productos para exportar.");
      return;
    }

    const headers = ["ID", "Nombre", "Categoría", "Precio Costo", "Precio Venta", "Stock Actual", "Mínimo Stock"];
    const rows = products.map(p => [
      p.id,
      p.name,
      p.category,
      p.costPrice,
      p.price,
      p.stock,
      p.minStockThreshold
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Inventario_Actualizado_${new Date().toLocaleDateString()}.csv`);
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
