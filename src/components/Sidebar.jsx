import React from 'react';
import { NavLink } from 'react-router-dom';
import { PlusCircle, BarChart3, LayoutDashboard, Database, Globe } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    {
      name: 'Service List',
      path: '/services',
      icon: Globe,
      badge: 'Shortcuts',
    },
    {
      name: 'Data Entry',
      path: '/data-entry',
      icon: PlusCircle,
      badge: 'Forms',
    },
    {
      name: 'Data View',
      path: '/data-view',
      icon: BarChart3,
      badge: 'Reports',
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: 'Stats',
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 glass-sidebar min-h-[calc(100vh-65px)] p-4 border-r border-slate-200/80">
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-3">
        Main Navigation
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/30 translate-x-1'
                    : 'text-slate-700 hover:bg-green-50 hover:text-green-700'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-green-100">
                {item.badge}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/60">
        <div className="flex items-center gap-2 text-green-800 font-bold text-xs mb-1">
          <Database className="w-4 h-4 text-green-600" />
          <span>Google Sheets Backend</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          All entries update Google Sheets & Drive live in real time.
        </p>
      </div>
    </aside>
  );
}
