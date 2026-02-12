
import React, { useState } from 'react';
import { Product } from '../types.ts';

const Inventory: React.FC<{ products: Product[], onAdd: (p: Product) => void, onUpdate: (p: Product) => void, onDelete: (id: string) => void }> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  
  const [form, setForm] = useState({ name: '', category: '', price: 0, stock: 0, min: 5 });

  const resetForm = () => {
    setForm({ name: '', category: '', price: 0, stock: 0, min: 5 });
    setEditing(null);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock, min: p.minStockThreshold });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      id: editing ? editing.id : Math.random().toString(36).substr(2, 9),
      name: form.name,
      category: form.category,
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Inventario</h1>
          <p className="text-slate-500 text-lg">Control total sobre tus productos y suministros.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-indigo-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Producto</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest text-center">Stock</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Precio</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Estado</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest text-right">Opciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length > 0 ? products.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 font-bold group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-lg">{p.name}</p>
                        <p className="text-sm text-slate-400">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-xl font-bold text-slate-800">{p.stock}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-bold text-indigo-600">${p.price.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-5">
                    {p.stock <= 0 ? (
                      <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Agotado</span>
                    ) : p.stock <= p.minStockThreshold ? (
                      <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Stock Bajo</span>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Saludable</span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => onDelete(p.id)} className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-400">Sin productos aún</h3>
                      <p className="text-slate-300">Añade tu primer item para empezar la gestión.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">{editing ? 'Editar Producto' : 'Añadir Producto'}</h2>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">Nombre del Producto</label>
                  <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-lg font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">Categoría</label>
                  <input required type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">Precio Venta</label>
                  <input required type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-indigo-600" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">Stock Inicial</label>
                  <input required type="number" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">Alerta de Stock (Mín.)</label>
                  <input required type="number" value={form.min} onChange={e => setForm({...form, min: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all" />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-[2rem] font-bold text-lg shadow-xl shadow-indigo-100 transition-all transform active:scale-95">
                {editing ? 'Guardar Cambios' : 'Añadir al Inventario'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Inventory;
