
import React, { useState } from 'react';
import { Product, Sale } from '../types.ts';

const Sales: React.FC<{ products: Product[], sales: Sale[], onSale: (s: Sale) => void }> = ({ products, sales, onSale }) => {
  const [pid, setPid] = useState('');
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');

  const selectedProduct = products.find(p => p.id === pid);
  const total = selectedProduct ? selectedProduct.price * qty : 0;
  const estimatedProfit = selectedProduct ? (selectedProduct.price - (selectedProduct.costPrice || 0)) * qty : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    if (qty > selectedProduct.stock) {
      setError(`Stock insuficiente. Solo quedan ${selectedProduct.stock} unidades.`);
      return;
    }

    if (qty <= 0) {
      setError('La cantidad debe ser mayor a 0.');
      return;
    }

    onSale({
      id: Math.random().toString(36).substr(2, 9),
      productId: pid,
      productName: selectedProduct.name,
      quantity: qty,
      totalPrice: total,
      totalProfit: estimatedProfit,
      date: new Date().toISOString()
    });
    
    setPid('');
    setQty(1);
    setError('');
  };

  return (
    <div className="animate-fade-in space-y-8 pb-10">
      <header>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Registro de Ventas</h1>
        <p className="text-slate-500 text-lg">Facturación con cálculo en tiempo real de utilidades.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center text-sm font-black">✓</span>
              Cobrar Venta
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Producto</label>
                <div className="relative">
                  <select 
                    required 
                    value={pid} 
                    onChange={e => { setPid(e.target.value); setError(''); }}
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold appearance-none text-slate-700"
                  >
                    <option value="">Selecciona un producto...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                        {p.name} - ${p.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Cantidad</label>
                <input 
                  required 
                  min="1" 
                  type="number" 
                  value={qty} 
                  onChange={e => { setQty(Number(e.target.value)); setError(''); }} 
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-xl font-black text-slate-800" 
                />
              </div>

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold animate-fade-in flex gap-2 items-center">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {error}
                </div>
              )}
              
              <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-inner space-y-3">
                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Venta Total</span>
                  <span className="text-white">${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  <span>Ganancia Estimada</span>
                  <span>+${estimatedProfit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-white border-t border-slate-800 pt-3 mt-2">
                  <span className="font-bold text-slate-400">TOTAL COBRO</span>
                  <span className="text-3xl font-black tracking-tight text-white">${total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={!pid || qty <= 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-300 text-white p-5 rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-100 transition-all transform active:scale-95 flex items-center justify-center gap-2"
              >
                Finalizar Venta
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full max-h-[750px]">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Historial de Utilidades</h2>
            </div>
            <div className="overflow-x-auto custom-scrollbar flex-1">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Producto / Fecha</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Cant.</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Cobro</th>
                    <th className="px-8 py-4 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] text-right">Ganancia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sales.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <p className="font-bold text-slate-900">{s.productName}</p>
                        <p className="text-[10px] font-medium text-slate-400">{new Date(s.date).toLocaleDateString()}</p>
                      </td>
                      <td className="px-8 py-5 text-center font-black text-slate-400">x{s.quantity}</td>
                      <td className="px-8 py-5 text-right font-bold text-slate-800">${s.totalPrice.toLocaleString()}</td>
                      <td className="px-8 py-5 text-right font-black text-emerald-600">+${s.totalProfit.toLocaleString()}</td>
                    </tr>
                  ))}
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
