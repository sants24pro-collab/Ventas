
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
    { id: View.AI_INSIGHTS, name: 'Inteligencia', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  ];

  return (
    <nav className="w-20 lg:w-72 bg-[#111111] flex flex-col items-center lg:items-stretch py-10 transition-all border-r border-[#222222]">
      <div className="px-8 mb-16 flex items-center gap-4">
        <div className="w-12 h-12 bg-[#F8F5F2] rounded-full flex items-center justify-center text-[#111111] font-black shadow-lg">S</div>
        <span className="hidden lg:block font-extrabold text-2xl tracking-tighter text-[#F8F5F2]">EliteStock</span>
      </div>
      
      <div className="flex-1 px-4 space-y-3">
        {menu.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-full transition-all duration-300 ${
              currentView === item.id 
                ? 'bg-[#F8F5F2] text-[#111111] font-bold shadow-xl shadow-white/5' 
                : 'text-[#666666] hover:text-[#F8F5F2] hover:bg-white/5'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
            </svg>
            <span className="hidden lg:block text-sm uppercase tracking-widest">{item.name}</span>
          </button>
        ))}
      </div>
      
      <div className="px-6 space-y-4">
        <button 
          onClick={onExport}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-full text-[#F8F5F2]/60 hover:text-[#F8F5F2] border border-white/10 hover:border-white/20 transition-all text-xs font-bold uppercase tracking-widest"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 9l-4-4m0 0L8 9m4-4v12" />
          </svg>
          <span className="hidden lg:block">Backup</span>
        </button>
      </div>

      <div className="px-8 mt-10 hidden lg:block">
        <div className="p-5 bg-white/5 rounded-[2rem] border border-white/5">
          <p className="text-[10px] text-[#444444] font-black uppercase tracking-widest mb-1">Cuenta</p>
          <p className="text-sm font-bold text-[#F8F5F2]">Admin Premium</p>
        </div>
      </div>
    </nav>
  );
};
export default Sidebar;
