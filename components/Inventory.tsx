
import React, { useState } from 'react';
import { Product } from '../types.ts';

const Inventory: React.FC<{ products: Product[], onAdd: (p: Product) => void, onUpdate: (p: Product) => void, onDelete: (id: string) => void }> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  
  const [form, setForm] = useState({ 
    name: '', 
    category: '', 
    costPrice: '' as string | number, 
    price: '' as string | number, 
    stock: '' as string | number, 
    min: '5' as string | number 
  });

  const resetForm = () => {
    setForm({ name: '', category: '', costPrice: '', price: '', stock: '', min: 5 });
    setEditing(null);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ 
      name: p.name, 
      category: p.category, 
      costPrice: p.costPrice, 
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
      costPrice: Number(form.costPrice) || 0,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      minStockThreshold: Number(form.min) || 0
    };
    editing ? onUpdate(data) : onAdd(data);
    setShowModal(false);
    resetForm();
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
          <h1 className="text-6xl md:text-7xl font-black text-[#111111] tracking-tighter mb-4 uppercase">Stock</h1>
          <p className="text-[#888888] text-xl font-light italic tracking-tight">Catálogo de activos de alta gama.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-[#111111] hover:bg-black text-[#F8F5F2] px-12 py-6 rounded-full font-black text-[10px] uppercase tracking-[0.4em] transition-all shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:-translate-y-1 active:scale-95 flex items-center gap-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          Nuevo Activo
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-[#E5E0D8] shadow-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#E5E0D8]">
                <th className="px-12 py-8 text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.4em]">Referencia</th>
                <th className="px-12 py-8 text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.4em] text-center">Stock</th>
                <th className="px-12 py-8 text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.4em]">Valores</th>
                <th className="px-12 py-8 text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.4em]">Neto</th>
                <th className="px-12 py-8 text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.4em] text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EBE3]">
              {products.length > 0 ? products.map(p => {
                const profit = p.price - p.costPrice;
                const margin = p.costPrice > 0 ? ((profit / p.price) * 100).toFixed(1) : '100';
                
                return (
                  <tr key={p.id} className="hover:bg-[#FAF9F6] transition-all group">
                    <td className="px-12 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-[#111111] rounded-[1.2rem] flex items-center justify-center text-[#F8F5F2] text-xl font-black shadow-lg">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-[#111111] text-xl tracking-tight leading-none mb-1">{p.name}</p>
                          <p className="text-[9px] text-[#BBBBBB] uppercase font-black tracking-widest">{p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-8 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-2xl font-black tracking-tighter ${p.stock <= p.minStockThreshold ? 'text-rose-600' : 'text-[#111111]'}`}>{p.stock}</span>
                      </div>
                    </td>
                    <td className="px-12 py-8">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-[#BBBBBB] font-black uppercase tracking-[0.2em] mb-1">C: ${p.costPrice.toLocaleString()}</span>
                        <span className="font-black text-[#111111] text-2xl tracking-tighter">V: ${p.price.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-12 py-8">
                      <div className="flex flex-col">
                        <span className="font-black text-emerald-700 text-xl tracking-tighter">+${profit.toLocaleString()}</span>
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic opacity-60">{margin}%</span>
                      </div>
                    </td>
                    <td className="px-12 py-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => openEdit(p)} className="w-10 h-10 flex items-center justify-center text-[#111111] bg-[#F8F5F2] border border-[#E5E0D8] rounded-full hover:bg-[#111111] hover:text-white transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => onDelete(p.id)} className="w-10 h-10 flex items-center justify-center text-rose-500 bg-rose-50 rounded-full hover:bg-rose-500 hover:text-white transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-12 py-40 text-center opacity-20 italic text-2xl tracking-widest uppercase font-light">Sin inventario registrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL REDISEÑADO: EL BOTÓN SIEMPRE ESTÁ VISIBLE */}
      {showModal && (
        <div className="fixed inset-0 bg-[#111111]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-[#F8F5F2] w-full max-w-xl rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col max-h-[90vh] overflow-hidden animate-fade-in">
            
            {/* Header Fijo */}
            <div className="p-8 border-b border-[#E5E0D8] flex justify-between items-center bg-white shrink-0">
              <div>
                <h2 className="text-2xl font-black text-[#111111] tracking-tighter uppercase">{editing ? 'Editar' : 'Ingresar'}</h2>
                <p className="text-[9px] font-black text-[#BBBBBB] uppercase tracking-[0.4em] mt-1">Activo Elite Store</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="w-10 h-10 flex items-center justify-center bg-[#F8F5F2] text-[#111111] hover:bg-black hover:text-white rounded-full transition-all"
              >✕</button>
            </div>
            
            {/* Cuerpo con Scroll */}
            <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                <div>
                  <label className="block text-[9px] font-black text-[#888888] mb-2 uppercase tracking-[0.3em]">Nombre del Artículo</label>
                  <input 
                    required 
                    type="text" 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})} 
                    className="w-full bg-white border border-[#E5E0D8] p-5 rounded-2xl outline-none focus:border-[#111111] transition-all text-xl font-black text-[#111111]" 
                    placeholder="Ej. Bolso de Piel" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black text-[#888888] mb-2 uppercase tracking-[0.3em]">Categoría</label>
                    <input 
                      required 
                      type="text" 
                      value={form.category} 
                      onChange={e => setForm({...form, category: e.target.value})} 
                      className="w-full bg-white border border-[#E5E0D8] p-4 rounded-xl outline-none focus:border-[#111111] transition-all font-bold text-[#111111]" 
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-[#888888] mb-2 uppercase tracking-[0.3em]">Stock Inicial</label>
                    <input 
                      required 
                      type="number" 
                      onFocus={handleFocus}
                      value={form.stock} 
                      onChange={e => setForm({...form, stock: e.target.value})} 
                      className="w-full bg-white border border-[#E5E0D8] p-4 rounded-xl outline-none focus:border-[#111111] transition-all font-black text-xl text-[#111111]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black text-[#888888] mb-2 uppercase tracking-[0.3em]">Costo Compra ($)</label>
                    <input 
                      required 
                      type="number" 
                      step="0.01" 
                      onFocus={handleFocus}
                      value={form.costPrice} 
                      onChange={e => setForm({...form, costPrice: e.target.value})} 
                      className="w-full bg-[#FAF9F6] border border-[#E5E0D8] p-4 rounded-xl outline-none focus:border-[#111111] transition-all font-black text-xl text-[#888888]" 
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-[#888888] mb-2 uppercase tracking-[0.3em]">Precio Venta ($)</label>
                    <input 
                      required 
                      type="number" 
                      step="0.01" 
                      onFocus={handleFocus}
                      value={form.price} 
                      onChange={e => setForm({...form, price: e.target.value})} 
                      className="w-full bg-white border border-[#E5E0D8] p-4 rounded-xl outline-none focus:border-[#111111] transition-all font-black text-xl text-[#111111]" 
                    />
                  </div>
                </div>

                <div>
                   <label className="block text-[9px] font-black text-[#888888] mb-2 uppercase tracking-[0.3em]">Mínimo para Alerta</label>
                   <input 
                    required 
                    type="number" 
                    onFocus={handleFocus}
                    value={form.min} 
                    onChange={e => setForm({...form, min: e.target.value})} 
                    className="w-full bg-white border border-[#E5E0D8] p-4 rounded-xl outline-none focus:border-[#111111] transition-all font-bold text-[#111111]" 
                   />
                </div>
              </div>

              {/* FOOTER FIJO CON EL BOTÓN - Esto asegura que nunca se tape */}
              <div className="p-8 border-t border-[#E5E0D8] bg-white shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                <button 
                  type="submit" 
                  className="w-full bg-[#111111] hover:bg-black text-[#F8F5F2] py-6 rounded-full font-black text-xs tracking-[0.5em] shadow-xl transition-all active:scale-95 uppercase"
                >
                  {editing ? 'Guardar Cambios' : 'Confirmar Ingreso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Inventory;
