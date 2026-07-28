import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'green', subtitle }) {
  const colorStyles = {
    green: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50',
    blue: 'bg-blue-500/10 text-blue-600 border-blue-200/50',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-200/50',
    amber: 'bg-amber-500/10 text-amber-600 border-amber-200/50',
    red: 'bg-red-500/10 text-red-600 border-red-200/50',
    indigo: 'bg-indigo-500/10 text-indigo-600 border-indigo-200/50',
  };

  return (
    <div className="glass-card p-5 rounded-3xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            {title}
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {typeof value === 'number' && title.toLowerCase().includes('balance') || title.toLowerCase().includes('income') || title.toLowerCase().includes('expense') || title.toLowerCase().includes('investment') || title.toLowerCase().includes('fund')
              ? `₹${value.toLocaleString('en-IN')}`
              : value}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-slate-400 font-medium mt-1">{subtitle}</p>
          )}
        </div>

        <div className={`p-3.5 rounded-2xl border ${colorStyles[color] || colorStyles.green} transition-transform group-hover:scale-110`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
    </div>
  );
}
