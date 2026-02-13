
import React from 'react';
import { View } from '../types.ts';

interface SidebarProps {
  currentView: View;
  setView: (v: View) => void;
  onExport: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onExport }) => {
  const menu = [
    { id: View.DASHBOARD, name: 'Resumen', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
    { id: View.INVENTORY, name: 'Inventario', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: View.SALES, name: 'Ventas', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { id: View.AI_INSIGHTS, name: 'Estrategia IA', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  ];

  return (
    <nav className="w-20 lg:w-72 bg-[#111111] flex flex-col items-center lg:items-stretch py-12 transition-all border-r border-[#222222] shadow-2xl">
      <div className="px-8 mb-20 flex items-center gap-4">
        <div className="w-14 h-14 bg-[#F8F5F2] rounded-full flex items-center justify-center text-[#111111] font-black text-2xl shadow-inner">S</div>
        <span className="hidden lg:block font-black text-2xl tracking-tighter text-[#F8F5F2] italic uppercase">Elite Store</span>
      </div>
      
      <div className="flex-1 px-4 space-y-4">
        {menu.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-5 px-6 py-5 rounded-full transition-all duration-500 group ${
              currentView === item.id 
                ? 'bg-[#F8F5F2] text-[#111111] font-black shadow-xl scale-105' 
                : 'text-[#555555] hover:text-[#F8F5F2] hover:bg-white/5'
            }`}
          >
            <svg className={`w-6 h-6 shrink-0 transition-transform duration-300 ${currentView === item.id ? '' : 'group-hover:rotate-12'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={currentView === item.id ? 2.5 : 2} d={item.icon} />
            </svg>
            <span className="hidden lg:block text-[10px] uppercase font-black tracking-[0.2em]">{item.name}</span>
          </button>
        ))}
      </div>
      
      <div className="px-6 space-y-4 mt-auto">
        <button 
          onClick={onExport}
          className="w-full flex items-center justify-center lg:justify-start gap-4 px-6 py-5 rounded-full bg-[#D1CCC7]/10 text-[#D1CCC7] border border-[#D1CCC7]/20 hover:bg-[#D1CCC7] hover:text-[#111111] transition-all group duration-300 shadow-lg hover:shadow-[#D1CCC7]/20"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="hidden lg:block text-[9px] font-black uppercase tracking-[0.3em]">Exportar Reporte</span>
        </button>
      </div>

      <div className="px-8 mt-12 hidden lg:block opacity-40">
        <div className="h-[1px] bg-white/10 mb-8 w-full"></div>
        <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[9px] text-[#555555] font-black uppercase tracking-widest mb-1">Status</p>
            <p className="text-xs font-bold text-[#F8F5F2]">Cloud Secure</p>
          </div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </nav>
  );
};
export default Sidebar;
