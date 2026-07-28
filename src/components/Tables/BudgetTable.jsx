import React from 'react';
import { Edit2, Trash2, Tag, Calendar, DollarSign } from 'lucide-react';
import Swal from 'sweetalert2';

export default function BudgetTable({ data, onEdit, onDelete }) {
  const handleDelete = (id, type, amount) => {
    Swal.fire({
      title: 'Delete Entry?',
      text: `Are you sure you want to delete this ${type} entry of ₹${amount}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      customClass: {
        popup: 'rounded-3xl',
        confirmButton: 'rounded-2xl font-bold px-4 py-2',
        cancelButton: 'rounded-2xl font-bold px-4 py-2',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id);
      }
    });
  };

  const getTypeBadge = (type) => {
    const styles = {
      'Starting Amount': 'bg-blue-100 text-blue-800 border-blue-200',
      Income: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      Investment: 'bg-purple-100 text-purple-800 border-purple-200',
      Expense: 'bg-red-100 text-red-800 border-red-200',
      Fund: 'bg-amber-100 text-amber-800 border-amber-200',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[type] || 'bg-slate-100 text-slate-800'}`}>
        {type}
      </span>
    );
  };

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center bg-white/60 backdrop-blur-md rounded-3xl border border-slate-200/80">
        <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-2" />
        <h4 className="font-bold text-slate-700 text-sm">No Budget Records Found</h4>
        <p className="text-xs text-slate-400 mt-1">Add a new transaction or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <th className="py-3.5 px-4">Date</th>
            <th className="py-3.5 px-4">Type</th>
            <th className="py-3.5 px-4">Category</th>
            <th className="py-3.5 px-4">Description</th>
            <th className="py-3.5 px-4 text-right">Amount</th>
            <th className="py-3.5 px-4 text-right">Running Balance</th>
            <th className="py-3.5 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-800">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-green-50/30 transition-colors">
              <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-700">
                {row.date}
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                {getTypeBadge(row.type)}
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap font-bold text-green-700">
                {row.category || '-'}
              </td>
              <td className="py-3.5 px-4 max-w-xs truncate text-slate-600">
                {row.description || '-'}
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap text-right font-extrabold text-slate-900">
                ₹{Number(row.amount).toLocaleString('en-IN')}
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap text-right font-extrabold text-green-600">
                ₹{Number(row.balance || 0).toLocaleString('en-IN')}
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => onEdit(row)}
                    className="p-1.5 rounded-xl text-slate-600 hover:text-green-600 hover:bg-green-50 transition-all"
                    title="Edit Record"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(row.id, row.type, row.amount)}
                    className="p-1.5 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
