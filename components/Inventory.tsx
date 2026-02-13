
import React, { useState } from 'react';
import { Product } from '../types.ts';

const Inventory: React.FC<{ products: Product[], onAdd: (p: Product) => void, onUpdate: (p: Product) => void, onDelete: (id: string) => void }> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  
  // Usamos strings para el formulario para permitir campos vacíos mientras el usuario escribe
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

  // Función para manejar el focus y seleccionar el texto automáticamente
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => e.target.select();

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
          <h1 className="text-6xl md:text-7xl font-black text-[#111111] tracking-tighter mb-4 uppercase">Stock</h1>
          <p className="text-[#888888] text-xl font-light italic tracking-tight">Gestión de activos y catálogo de alta gama.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-[#111111] hover:bg-black text-[#F8F5F2] px-12 py-6 rounded-full font-black text-[10px] uppercase tracking-[0.4em] transition-all shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:-translate-y-1 active:scale-95 flex items-center gap-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          Nuevo Activo
        </button>
      </div>

      <div className="bg-white rounded-[4rem] border border-[#E5E0D8] shadow-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#E5E0D8]">
                <th className="px-12 py-8 text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.4em]">Referencia</th>
                <th className="px-12 py-8 text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.4em] text-center">Stock</th>
                <th className="px-12 py-8 text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.4em]">Valuación</th>
                <th className="px-12 py-8 text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.4em]">Neto</th>
                <th className="px-12 py-8 text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.4em] text-right">Opciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EBE3]">
              {products.length > 0 ? products.map(p => {
                const profit = p.price - p.costPrice;
                const margin = p.costPrice > 0 ? ((profit / p.price) * 100).toFixed(1) : '100';
                
                return (
                  <tr key={p.id} className="hover:bg-[#FAF9F6] transition-all group">
                    <td className="px-12 py-8">
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 bg-[#111111] rounded-[1.5rem] flex items-center justify-center text-[#F8F5F2] text-2xl font-black shadow-lg">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-[#111111] text-xl tracking-tight leading-none mb-1">{p.name}</p>
                          <p className="text-[10px] text-[#BBBBBB] uppercase font-black tracking-widest">{p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-8 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-3xl font-black tracking-tighter ${p.stock <= p.minStockThreshold ? 'text-rose-600' : 'text-[#111111]'}`}>{p.stock}</span>
                        {p.stock <= p.minStockThreshold && (
                          <span className="text-[9px] text-rose-600 font-black uppercase tracking-widest mt-1">Reponer</span>
                        )}
                      </div>
                    </td>
                    <td className="px-12 py-8">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#BBBBBB] font-black uppercase tracking-[0.2em] mb-1">C: ${p.costPrice.toLocaleString()}</span>
                        <span className="font-black text-[#111111] text-2xl tracking-tighter">V: ${p.price.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-12 py-8">
                      <div className="flex flex-col">
                        <span className="font-black text-emerald-700 text-xl tracking-tighter">+${profit.toLocaleString()}</span>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic opacity-60">{margin}% Margen</span>
                      </div>
                    </td>
                    <td className="px-12 py-8 text-right">
                      <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                        <button onClick={() => openEdit(p)} className="w-12 h-12 flex items-center justify-center text-[#111111] bg-[#F8F5F2] border border-[#E5E0D8] rounded-full transition-all hover:bg-[#111111] hover:text-white hover:shadow-xl">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => onDelete(p.id)} className="w-12 h-12 flex items-center justify-center text-rose-500 bg-rose-50 rounded-full transition-all hover:bg-rose-500 hover:text-white hover:shadow-xl">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-12 py-40 text-center opacity-20">
                    <p className="text-2xl font-light italic tracking-widest">Sin registros en el catálogo</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL REDISEÑADO PARA EVITAR QUE SE TAPE */}
      {showModal && (
        <div className="fixed inset-0 bg-[#111111]/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4 md:p-10 overflow-hidden">
          <div className="bg-[#FAF9F6] rounded-[3.5rem] w-full max-w-2xl shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in border border-white/10 flex flex-col max-h-[90vh]">
            <div className="px-8 md:px-12 py-8 border-b border-[#E5E0D8] flex justify-between items-center bg-white shrink-0">
              <div>
                <h2 className="text-3xl font-black text-[#111111] tracking-tighter uppercase">{editing ? 'Editar' : 'Registrar'}</h2>
                <p className="text-[9px] font-black text-[#BBBBBB] uppercase tracking-[0.4em] mt-1">Artículos Elite Store</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center bg-[#F8F5F2] text-[#111111] hover:bg-black hover:text-white rounded-full transition-all text-sm">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 md:p-12 space-y-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="space-y-8">
                <div>
                  <label className="block text-[9px] font-black text-[#888888] mb-3 uppercase tracking-[0.3em]">Nombre del Artículo</label>
                  <input 
                    required 
                    type="text" 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})} 
                    className="w-full bg-white border border-[#E5E0D8] p-5 rounded-2xl outline-none focus:border-[#111111] transition-all text-xl font-black text-[#111111] shadow-inner" 
                    placeholder="Ej. Bolso de Piel" 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[9px] font-black text-[#888888] mb-3 uppercase tracking-[0.3em]">Categoría</label>
                    <input 
                      required 
                      type="text" 
                      value={form.category} 
                      onChange={e => setForm({...form, category: e.target.value})} 
                      className="w-full bg-white border border-[#E5E0D8] p-5 rounded-2xl outline-none focus:border-[#111111] transition-all font-bold text-[#111111]" 
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-[#888888] mb-3 uppercase tracking-[0.3em]">Stock Inicial</label>
                    <input 
                      required 
                      type="number" 
                      onFocus={handleFocus}
                      value={form.stock} 
                      onChange={e => setForm({...form, stock: e.target.value})} 
                      className="w-full bg-white border border-[#E5E0D8] p-5 rounded-2xl outline-none focus:border-[#111111] transition-all font-black text-xl text-[#111111]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[9px] font-black text-[#888888] mb-3 uppercase tracking-[0.3em]">Costo Adquisición ($)</label>
                    <input 
                      required 
                      type="number" 
                      step="0.01" 
                      onFocus={handleFocus}
                      value={form.costPrice} 
                      onChange={e => setForm({...form, costPrice: e.target.value})} 
                      className="w-full bg-[#FAF9F6] border border-[#E5E0D8] p-5 rounded-2xl outline-none focus:border-[#111111] transition-all font-black text-xl text-[#888888]" 
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-[#888888] mb-3 uppercase tracking-[0.3em]">Precio de Venta ($)</label>
                    <input 
                      required 
                      type="number" 
                      step="0.01" 
                      onFocus={handleFocus}
                      value={form.price} 
                      onChange={e => setForm({...form, price: e.target.value})} 
                      className="w-full bg-white border border-[#E5E0D8] p-5 rounded-2xl outline-none focus:border-[#111111] transition-all font-black text-xl text-[#111111]" 
                    />
                  </div>
                </div>

                <div>
                   <label className="block text-[9px] font-black text-[#888888] mb-3 uppercase tracking-[0.3em]">Mínimo para Alerta</label>
                   <input 
                    required 
                    type="number" 
                    onFocus={handleFocus}
                    value={form.min} 
                    onChange={e => setForm({...form, min: e.target.value})} 
                    className="w-full bg-white border border-[#E5E0D8] p-5 rounded-2xl outline-none focus:border-[#111111] transition-all font-bold text-[#111111]" 
                   />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#111111] hover:bg-black text-[#F8F5F2] p-7 rounded-full font-black text-xs tracking-[0.4em] shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 mt-10 uppercase shrink-0">
                {editing ? 'Confirmar Cambios' : 'Confirmar Adquisición'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Inventory;
