import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export default function DailyTrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-xs font-semibold">
        No daily trend data available yet.
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              border: 'none',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
            formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`]}
          />
          <Legend wrapperStyle={{ fontSize: '12px', pt: '10px' }} />
          <Bar dataKey="Income" fill="#16a34a" radius={[6, 6, 0, 0]} name="Income (₹)" />
          <Bar dataKey="Expense" fill="#ef4444" radius={[6, 6, 0, 0]} name="Expense (₹)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
