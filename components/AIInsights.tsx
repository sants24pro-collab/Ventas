
import React, { useState, useEffect } from 'react';
import { Product, Sale } from '../types.ts';
import { getAIInventoryAnalysis } from '../services/geminiService.ts';

const AIInsights: React.FC<{ products: Product[], sales: Sale[] }> = ({ products, sales }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const load = async () => {
    if (products.length === 0 && sales.length === 0) return;
    setLoading(true);
    const result = await getAIInventoryAnalysis(products, sales);
    setData(result);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="animate-fade-in space-y-10 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block">Powered by Gemini AI</span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Business Intelligence</h1>
          <p className="text-slate-500 text-lg">Análisis predictivo y recomendaciones para tu negocio.</p>
        </div>
        <button onClick={load} disabled={loading} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all disabled:opacity-50 shadow-xl">
          {loading ? 'Analizando...' : 'Actualizar Informe'}
        </button>
      </header>

      {loading ? (
        <div className="bg-white p-20 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Procesando Inteligencia</h2>
          <p className="text-slate-400 max-w-sm">Estamos analizando tus tendencias de venta y niveles de stock para darte los mejores consejos...</p>
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-200">
              <h3 className="text-indigo-200 font-bold uppercase tracking-widest text-sm mb-4">Análisis Ejecutivo</h3>
              <p className="text-2xl font-medium leading-relaxed italic">"{data.analysis}"</p>
            </div>
            
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-slate-900 font-bold text-xl mb-8 flex items-center gap-4">
                <span className="w-10 h-10 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">💡</span>
                Estrategias de Optimización
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.tips.map((tip: string, idx: number) => (
                  <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-colors">
                    <span className="text-3xl mb-4 block opacity-40 font-black text-slate-300">0{idx + 1}</span>
                    <p className="text-slate-700 font-semibold leading-snug">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-slate-900 font-bold text-xl mb-6 flex items-center gap-4">
                <span className="w-10 h-10 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">⚠️</span>
                Puntos Críticos
              </h3>
              <div className="space-y-4">
                {data.alerts.map((alert: string, idx: number) => (
                  <div key={idx} className="p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 font-bold text-sm leading-tight">
                    {alert}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[3rem] border border-slate-100 text-center">
          <p className="text-slate-400 text-xl font-medium italic">Empieza a registrar ventas para generar análisis inteligentes.</p>
        </div>
      )}
    </div>
  );
};
export default AIInsights;
