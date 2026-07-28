import React from 'react';
import { MessageSquare, PhoneCall, MoreHorizontal, Edit2, Trash2, User } from 'lucide-react';
import Swal from 'sweetalert2';

export default function FeedbackTable({ data, onMore, onEdit, onDelete }) {
  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Delete Feedback?',
      text: `Are you sure you want to delete feedback for ${name}?`,
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

  const handleWhatsApp = (phone) => {
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    window.open(`https://wa.me/91${cleanPhone}`, '_blank');
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center bg-white/60 backdrop-blur-md rounded-3xl border border-slate-200/80">
        <User className="w-12 h-12 text-slate-300 mx-auto mb-2" />
        <h4 className="font-bold text-slate-700 text-sm">No Feedback Entries Found</h4>
        <p className="text-xs text-slate-400 mt-1">Add feedback under Data Entry tab.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <th className="py-3.5 px-4">Customer Name</th>
            <th className="py-3.5 px-4">Phone Number</th>
            <th className="py-3.5 px-4">Service Name</th>
            <th className="py-3.5 px-4 text-center">Quick Actions</th>
            <th className="py-3.5 px-4 text-center">Manage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-800">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-green-50/30 transition-colors">
              <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900">
                {row.name}
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-600">
                {row.phone}
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-green-700">
                {row.service}
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleWhatsApp(row.phone)}
                    className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1.5 px-3 rounded-xl text-[11px] shadow-xs transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleCall(row.phone)}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-xl text-[11px] shadow-xs transition-all"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </button>
                </div>
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => onMore(row)}
                    className="p-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-green-100 hover:text-green-700 transition-all font-bold text-xs flex items-center gap-1"
                    title="View Details Drawer"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline">More</span>
                  </button>
                  <button
                    onClick={() => onEdit && onEdit(row)}
                    className="p-1.5 rounded-xl text-slate-600 hover:text-green-600 hover:bg-green-50 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(row.id, row.name)}
                    className="p-1.5 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all"
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
