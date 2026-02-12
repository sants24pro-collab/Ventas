
import React, { useState } from 'react';
import { Product } from '../types.ts';

const Inventory: React.FC<{ products: Product[], onAdd: (p: Product) => void, onUpdate: (p: Product) => void, onDelete: (id: string) => void }> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  
  const [form, setForm] = useState({ name: '', category: '', costPrice: 0, price: 0, stock: 0, min: 5 });

  const resetForm = () => {
    setForm({ name: '', category: '', costPrice: 0, price: 0, stock: 0, min: 5 });
    setEditing(null);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ 
      name: p.name, 
      category: p.category, 
      costPrice: p.costPrice || 0, 
      price: p.price, 
      stock: p.stock, 
      min: p.minStockThreshold 
    });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Product = {
      id: editing ? editing.id : Math.random().toString(36).substr(2, 9),
      name: form.name,
      category: form.category,
      costPrice: form.costPrice,
      price: form.price,
      stock: form.stock,
      minStockThreshold: form.min
    };
    editing ? onUpdate(data) : onAdd(data);
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black text-[#111111] tracking-tighter mb-2">Colección</h1>
          <p className="text-[#888888] text-lg font-medium">Gestión de activos y márgenes operativos.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-[#111111] hover:bg-black text-[#F8F5F2] px-10 py-5 rounded-full font-bold flex items-center gap-4 transition-all shadow-2xl hover:scale-105 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          AÑADIR ARTÍCULO
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-[#E5E0D8] shadow-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#E5E0D8]">
                <th className="px-10 py-6 text-[10px] font-black text-[#888888] uppercase tracking-[0.3em]">Articulo</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#888888] uppercase tracking-[0.3em] text-center">Unidades</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#888888] uppercase tracking-[0.3em]">Precios</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#888888] uppercase tracking-[0.3em]">Rentabilidad</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#888888] uppercase tracking-[0.3em] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EBE3]">
              {products.length > 0 ? products.map(p => {
                const profit = p.price - p.costPrice;
                const margin = p.costPrice > 0 ? ((profit / p.price) * 100).toFixed(1) : '100';
                
                return (
                  <tr key={p.id} className="hover:bg-[#FAF9F6] transition-colors group">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-[#111111] rounded-2xl flex items-center justify-center text-[#F8F5F2] text-xl font-black">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-[#111111] text-lg tracking-tight">{p.name}</p>
                          <p className="text-xs text-[#888888] uppercase font-bold tracking-widest">{p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-2xl font-black ${p.stock <= p.minStockThreshold ? 'text-rose-600' : 'text-[#111111]'}`}>{p.stock}</span>
                        {p.stock <= p.minStockThreshold && (
                          <span className="text-[10px] text-rose-600 font-black uppercase tracking-tighter">Stock Crítico</span>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#888888] font-black uppercase tracking-widest mb-1">Costo: ${p.costPrice.toLocaleString()}</span>
                        <span className="font-black text-[#111111] text-xl">Venta: ${p.price.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex flex-col">
                        <span className="font-black text-emerald-700 text-lg">+${profit.toLocaleString()}</span>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">{margin}% de margen</span>
                      </div>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(p)} className="p-3 text-[#111111] hover:bg-[#111111] hover:text-white rounded-full transition-all">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => onDelete(p.id)} className="p-3 text-rose-500 hover:bg-rose-500 hover:text-white rounded-full transition-all">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center text-[#BBBBBB]">
                    <p className="text-xl font-medium italic">Inventario vacío. Comience su colección hoy.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#111111]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F6] rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in border border-white/20 flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-[#E5E0D8] flex justify-between items-center bg-white">
              <h2 className="text-3xl font-black text-[#111111] tracking-tighter">{editing ? 'EDITAR ACTIVO' : 'NUEVO ARTÍCULO'}</h2>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center bg-[#F8F5F2] text-[#111111] hover:bg-black hover:text-white rounded-full transition-all">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-10 space-y-8 overflow-y-auto modal-scroll">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-[#888888] mb-3 uppercase tracking-[0.2em]">Nombre del Producto</label>
                  <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-white border border-[#E5E0D8] p-5 rounded-2xl outline-none focus:border-[#111111] transition-all text-xl font-bold text-[#111111]" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#888888] mb-3 uppercase tracking-[0.2em]">Categoría</label>
                  <input required type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-white border border-[#E5E0D8] p-5 rounded-2xl outline-none focus:border-[#111111] transition-all font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#888888] mb-3 uppercase tracking-[0.2em]">Stock Inicial</label>
                  <input required type="number" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})} className="w-full bg-white border border-[#E5E0D8] p-5 rounded-2xl outline-none focus:border-[#111111] transition-all font-black text-xl" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#888888] mb-3 uppercase tracking-[0.2em]">Precio de Costo ($)</label>
                  <input required type="number" step="0.01" value={form.costPrice} onChange={e => setForm({...form, costPrice: Number(e.target.value)})} className="w-full bg-white border border-[#E5E0D8] p-5 rounded-2xl outline-none focus:border-[#111111] transition-all font-black text-xl text-[#888888]" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#888888] mb-3 uppercase tracking-[0.2em]">Precio de Venta ($)</label>
                  <input required type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} className="w-full bg-white border border-[#E5E0D8] p-5 rounded-2xl outline-none focus:border-[#111111] transition-all font-black text-xl text-[#111111]" />
                </div>
                <div className="md:col-span-2">
                   <label className="block text-[10px] font-black text-[#888888] mb-3 uppercase tracking-[0.2em]">Umbral de Alerta Stock</label>
                   <input required type="number" value={form.min} onChange={e => setForm({...form, min: Number(e.target.value)})} className="w-full bg-white border border-[#E5E0D8] p-5 rounded-2xl outline-none focus:border-[#111111] transition-all font-bold" />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#111111] hover:bg-black text-[#F8F5F2] p-6 rounded-full font-black text-lg tracking-widest shadow-2xl transition-all transform active:scale-95 mt-4">
                {editing ? 'GUARDAR CAMBIOS' : 'CONFIRMAR ADQUISICIÓN'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Inventory;
