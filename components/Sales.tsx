
import React, { useState } from 'react';
import { Product, Sale } from '../types.ts';

const Sales: React.FC<{ products: Product[], sales: Sale[], onSale: (s: Sale) => void }> = ({ products, sales, onSale }) => {
  const [pid, setPid] = useState('');
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');

  const selectedProduct = products.find(p => p.id === pid);
  const total = selectedProduct ? selectedProduct.price * qty : 0;

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
        <p className="text-slate-500 text-lg">Facturación rápida y control de salida de mercancía.</p>
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
                        {p.name} (${p.price.toLocaleString()}) - {p.stock > 0 ? `${p.stock} en stock` : 'AGOTADO'}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
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
              
              <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-inner">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                  <span>Precio Unitario</span>
                  <span>${(selectedProduct?.price || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-white border-t border-slate-800 pt-3 mt-2">
                  <span className="font-bold text-slate-400">TOTAL</span>
                  <span className="text-3xl font-black tracking-tight text-emerald-400">${total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={!pid || qty <= 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-300 text-white p-5 rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-100 transition-all transform active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Finalizar Venta
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full max-h-[750px]">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Registro de Movimientos</h2>
              <span className="bg-slate-100 text-slate-500 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">{sales.length} Operaciones</span>
            </div>
            <div className="overflow-x-auto custom-scrollbar flex-1">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Fecha / Hora</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Descripción</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Cant.</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sales.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-slate-700">{new Date(s.date).toLocaleDateString()}</p>
                        <p className="text-[10px] font-medium text-slate-400">{new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{s.productName}</span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-black">x{s.quantity}</span>
                      </td>
                      <td className="px-8 py-5 text-right font-black text-emerald-600 text-lg">${s.totalPrice.toLocaleString()}</td>
                    </tr>
                  ))}
                  {sales.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-32 text-center">
                        <div className="flex flex-col items-center space-y-3 opacity-20">
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                          <p className="text-xl font-black uppercase tracking-widest">Sin actividad hoy</p>
                        </div>
                      </td>
                    </tr>
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
