
import React from 'react';
import { Product, Sale } from '../types.ts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Dashboard: React.FC<{ products: Product[], sales: Sale[] }> = ({ products, sales }) => {
  const totalIncome = sales.reduce((acc, s) => acc + s.totalPrice, 0);
  const totalProfit = sales.reduce((acc, s) => acc + s.totalProfit, 0);
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const inventoryValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock <= p.minStockThreshold).length;

  const chartData = [...sales].reverse().slice(0, 10).map(s => ({
    label: s.productName.length > 8 ? s.productName.substring(0, 8) + '..' : s.productName,
    ingreso: s.totalPrice,
    ganancia: s.totalProfit
  }));

  const stockData = products
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5)
    .map(p => ({
      name: p.name.length > 12 ? p.name.substring(0, 12) + '..' : p.name,
      cantidad: p.stock
    }));

  const MetricCard = ({ title, value, color, icon, subtitle }: any) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-indigo-100">
      <div className={`w-12 h-12 ${color} text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
        {icon}
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
      {subtitle && <p className="text-[10px] text-slate-400 mt-1 font-bold">{subtitle}</p>}
    </div>
  );

  return (
    <div className="animate-fade-in space-y-8 pb-10">
      <header>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Panel de Control</h1>
        <p className="text-slate-500 text-lg">Visión general de la rentabilidad de tu negocio.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Ganancia Total" 
          value={`$${totalProfit.toLocaleString()}`} 
          color="bg-emerald-600"
          subtitle={`De un total de $${totalIncome.toLocaleString()} en ingresos`}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        />
        <MetricCard 
          title="Valor Activo" 
          value={`$${inventoryValue.toLocaleString()}`} 
          color="bg-indigo-500"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
        />
        <MetricCard 
          title="Stock en Tienda" 
          value={totalStock} 
          color="bg-sky-500"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>}
        />
        <MetricCard 
          title="Alertas Críticas" 
          value={lowStockCount} 
          color="bg-rose-500"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Rendimiento de Ventas</h2>
            <div className="flex gap-4">
               <div className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-500 rounded-full"></div><span className="text-[10px] font-bold text-slate-400">INGRESO</span></div>
               <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div><span className="text-[10px] font-bold text-slate-400">GANANCIA</span></div>
            </div>
          </div>
          <div className="h-72">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="ingreso" stroke="#6366f1" strokeWidth={3} dot={{ r: 3, fill: '#6366f1' }} />
                  <Line type="monotone" dataKey="ganancia" stroke="#10b981" strokeWidth={3} dot={{ r: 3, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-2">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                <p className="italic font-medium">No hay ventas para mostrar</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Ranking de Inventario</h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top 5 productos</span>
          </div>
          <div className="h-72">
            {stockData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockData} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={90} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Bar dataKey="cantidad" fill="#818cf8" radius={[0, 10, 10, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-2">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                <p className="italic font-medium">Registra productos para ver ranking</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
