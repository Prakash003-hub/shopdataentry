import React from 'react';
import { NavLink } from 'react-router-dom';
import { PlusCircle, BarChart3, LayoutDashboard, Globe } from 'lucide-react';

export default function BottomNav() {
  const items = [
    {
      name: 'Services',
      path: '/services',
      icon: Globe,
      label: 'Services',
    },
    {
      name: 'Data Entry',
      path: '/data-entry',
      icon: PlusCircle,
      label: 'Data Entry',
    },
    {
      name: 'Data View',
      path: '/data-view',
      icon: BarChart3,
      label: 'Data View',
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-2 pb-safe bg-slate-900/10 pointer-events-none">
      <nav className="pointer-events-auto max-w-md mx-auto glass-nav bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-2xl rounded-3xl p-1.5 flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl min-h-[48px] text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-green-600 text-white shadow-md shadow-green-600/30 scale-102'
                    : 'text-slate-600 hover:text-green-600 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] leading-tight font-bold">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
