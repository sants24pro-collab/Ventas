
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
    const saved = localStorage.getItem('sm_v2_products');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('sm_v2_sales');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sm_v2_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sm_v2_sales', JSON.stringify(sales));
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

  const exportData = () => {
    const convertToCSV = (objArray: any[]) => {
      if (objArray.length === 0) return '';
      const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
      let str = '';
      const header = Object.keys(array[0]).join(',');
      str += header + '\r\n';
      for (let i = 0; i < array.length; i++) {
        let line = '';
        for (const index in array[i]) {
          if (line !== '') line += ',';
          line += '"' + array[i][index] + '"';
        }
        str += line + '\r\n';
      }
      return str;
    };

    const productCSV = convertToCSV(products);
    const salesCSV = convertToCSV(sales);

    const download = (content: string, fileName: string) => {
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    if (products.length > 0) download(productCSV, `Inventario_${new Date().toLocaleDateString()}.csv`);
    if (sales.length > 0) setTimeout(() => download(salesCSV, `Ventas_${new Date().toLocaleDateString()}.csv`), 500);
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
      <Sidebar currentView={view} setView={setView} onExport={exportData} />
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar">
        <div className="p-6 md:p-12 max-w-7xl mx-auto min-h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
