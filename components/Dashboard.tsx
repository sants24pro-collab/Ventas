
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
    label: s.productName.substring(0, 6),
    ingreso: s.totalPrice,
    ganancia: s.totalProfit
  }));

  const MetricCard = ({ title, value, color, icon, subtitle }: any) => (
    <div className="bg-white p-10 rounded-[3rem] border border-[#E5E0D8] shadow-sm transition-all hover:shadow-xl group">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 shadow-xl transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-[#888888] uppercase tracking-[0.3em] mb-2">{title}</p>
      <h3 className="text-4xl font-black text-[#111111] tracking-tighter">{value}</h3>
      {subtitle && <p className="text-xs text-[#AAAAAA] mt-2 font-medium italic">{subtitle}</p>}
    </div>
  );

  return (
    <div className="animate-fade-in space-y-12 pb-16">
      <header>
        <h1 className="text-6xl font-black text-[#111111] tracking-tighter mb-2">Visión Global</h1>
        <p className="text-[#888888] text-xl font-medium">Análisis de rendimiento y rentabilidad boutique.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricCard 
          title="Utilidad Neta" 
          value={`$${totalProfit.toLocaleString()}`} 
          color="bg-[#111111] text-[#F8F5F2]"
          subtitle={`De $${totalIncome.toLocaleString()} facturados`}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        />
        <MetricCard 
          title="Valor Stock" 
          value={`$${inventoryValue.toLocaleString()}`} 
          color="bg-[#FAF9F6] text-[#111111] border border-[#E5E0D8]"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4" /></svg>}
        />
        <MetricCard 
          title="Activos" 
          value={totalStock} 
          color="bg-[#F2EBE3] text-[#111111]"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 8h14M5 8a2 2 0 110-4" /></svg>}
        />
        <MetricCard 
          title="Alertas" 
          value={lowStockCount} 
          color={lowStockCount > 0 ? "bg-rose-500 text-white" : "bg-[#FAF9F6] text-[#BBBBBB]"}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-12 rounded-[3.5rem] border border-[#E5E0D8] shadow-sm">
          <h2 className="text-2xl font-black text-[#111111] tracking-tight mb-10 uppercase tracking-widest">Rendimiento Operativo</h2>
          <div className="h-80">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2EBE3" />
                  <XAxis dataKey="label" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#111111', color: '#F8F5F2', border: 'none', borderRadius: '15px' }} />
                  <Line type="monotone" dataKey="ingreso" stroke="#111111" strokeWidth={4} dot={{ r: 4, fill: '#111111' }} />
                  <Line type="monotone" dataKey="ganancia" stroke="#D1CCC7" strokeWidth={4} dot={{ r: 4, fill: '#D1CCC7' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#BBBBBB] italic">Sin datos suficientes</div>
            )}
          </div>
        </div>

        <div className="bg-white p-12 rounded-[3.5rem] border border-[#E5E0D8] shadow-sm">
           <h2 className="text-2xl font-black text-[#111111] tracking-tight mb-10 uppercase tracking-widest">Distribución de Stock</h2>
           <div className="h-80">
            {products.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={products.slice(0, 5)} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#888888" fontSize={10} width={80} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '15px' }} />
                  <Bar dataKey="stock" fill="#111111" radius={[0, 10, 10, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#BBBBBB] italic">Sin productos en stock</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
