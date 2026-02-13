
import React, { useState } from 'react';
import { Product, Sale } from '../types.ts';

const Sales: React.FC<{ products: Product[], sales: Sale[], onSale: (s: Sale) => void }> = ({ products, sales, onSale }) => {
  const [pid, setPid] = useState('');
  const [qty, setQty] = useState<string | number>(1);
  const [error, setError] = useState('');

  const selectedProduct = products.find(p => p.id === pid);
  const numericQty = Number(qty) || 0;
  const total = selectedProduct ? selectedProduct.price * numericQty : 0;
  const estimatedProfit = selectedProduct ? (selectedProduct.price - (selectedProduct.costPrice || 0)) * numericQty : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    if (numericQty > selectedProduct.stock) {
      setError(`Stock insuficiente. Solo quedan ${selectedProduct.stock} unidades.`);
      return;
    }

    if (numericQty <= 0) {
      setError('La cantidad debe ser mayor a 0.');
      return;
    }

    onSale({
      id: Math.random().toString(36).substr(2, 9),
      productId: pid,
      productName: selectedProduct.name,
      quantity: numericQty,
      totalPrice: total,
      totalProfit: estimatedProfit,
      date: new Date().toISOString()
    });
    
    setPid('');
    setQty(1);
    setError('');
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => e.target.select();

  return (
    <div className="animate-fade-in space-y-12 pb-16">
      <header>
        <h1 className="text-6xl font-black text-[#111111] tracking-tighter mb-2 uppercase">Ventas</h1>
        <p className="text-[#888888] text-xl font-medium">Registro de transacciones boutique.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <div className="bg-white p-10 rounded-[3.5rem] border border-[#E5E0D8] shadow-xl sticky top-8">
            <h2 className="text-[10px] font-black text-[#111111] mb-8 uppercase tracking-[0.4em]">Nueva Orden</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[9px] font-black text-[#888888] mb-3 uppercase tracking-widest">Artículo</label>
                <select 
                  required 
                  value={pid} 
                  onChange={e => setPid(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E0D8] p-5 rounded-2xl outline-none focus:border-[#111111] transition-all font-bold text-[#111111] appearance-none"
                >
                  <option value="">Buscar en catálogo...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                      {p.name} — ${p.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-[9px] font-black text-[#888888] mb-3 uppercase tracking-widest">Cantidad</label>
                <input 
                  required 
                  min="1" 
                  type="number" 
                  onFocus={handleFocus}
                  value={qty} 
                  onChange={e => setQty(e.target.value)} 
                  className="w-full bg-[#FAF9F6] border border-[#E5E0D8] p-5 rounded-2xl outline-none focus:border-[#111111] transition-all text-3xl font-black text-[#111111]" 
                />
              </div>

              {error && <div className="p-4 bg-rose-50 text-rose-600 text-xs font-bold rounded-2xl border border-rose-100">{error}</div>}
              
              <div className="p-8 bg-[#111111] rounded-[2.5rem] shadow-2xl space-y-4">
                <div className="flex justify-between text-[10px] font-black text-[#666666] uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-[#F8F5F2]">${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[#F8F5F2] border-t border-white/10 pt-4 mt-2">
                  <span className="text-[10px] font-black uppercase tracking-widest">Total Factura</span>
                  <span className="text-4xl font-black tracking-tighter">${total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={!pid}
                className="w-full bg-[#111111] hover:bg-black disabled:bg-[#F2EBE3] disabled:text-[#BBBBBB] text-[#F8F5F2] p-6 rounded-full font-black text-xs tracking-[0.4em] transition-all shadow-xl active:scale-95 uppercase"
              >
                Procesar Venta
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-[3.5rem] border border-[#E5E0D8] shadow-sm overflow-hidden flex flex-col max-h-[800px]">
            <div className="p-10 border-b border-[#E5E0D8] bg-white sticky top-0 z-10">
              <h2 className="text-[10px] font-black text-[#111111] uppercase tracking-[0.4em]">Diario de Transacciones</h2>
            </div>
            <div className="overflow-x-auto custom-scrollbar flex-1">
              <table className="w-full text-left">
                <thead className="bg-[#FAF9F6] border-b border-[#E5E0D8]">
                  <tr>
                    <th className="px-10 py-5 text-[10px] font-black text-[#888888] uppercase tracking-widest">Referencia</th>
                    <th className="px-10 py-5 text-[10px] font-black text-[#888888] uppercase tracking-widest text-center">Unid.</th>
                    <th className="px-10 py-5 text-[10px] font-black text-[#888888] uppercase tracking-widest text-right">Importe</th>
                    <th className="px-10 py-5 text-[10px] font-black text-emerald-700 uppercase tracking-widest text-right">Neto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EBE3]">
                  {sales.length > 0 ? sales.map(s => (
                    <tr key={s.id} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="px-10 py-6">
                        <p className="font-extrabold text-[#111111] text-lg tracking-tighter leading-none mb-1">{s.productName}</p>
                        <p className="text-[9px] font-black text-[#BBBBBB] uppercase tracking-widest">{new Date(s.date).toLocaleDateString()}</p>
                      </td>
                      <td className="px-10 py-6 text-center font-black text-[#888888]">x{s.quantity}</td>
                      <td className="px-10 py-6 text-right font-black text-[#111111]">${s.totalPrice.toLocaleString()}</td>
                      <td className="px-10 py-6 text-right font-black text-emerald-600">+${s.totalProfit.toLocaleString()}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="p-20 text-center text-[#BBBBBB] italic">Sin ventas registradas</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Sales;
