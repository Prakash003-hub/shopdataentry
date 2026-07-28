import React from 'react';
import { MessageSquare, PhoneCall, MoreVertical, UserCheck } from 'lucide-react';

export default function CustomerTable({ data, onMore }) {
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
        <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
        <h4 className="font-bold text-slate-700 text-sm">No Customer Records Found</h4>
        <p className="text-xs text-slate-400 mt-1">Add customer data under Data Entry tab.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <th className="py-3 px-3 sm:py-3.5 sm:px-4">Customer Name</th>
            <th className="py-3 px-3 sm:py-3.5 sm:px-4 text-center">Quick Contact</th>
            <th className="py-3 px-3 sm:py-3.5 sm:px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-800">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-green-50/30 transition-colors">
              {/* 1. Customer Name */}
              <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 whitespace-nowrap font-bold text-slate-900">
                {row.name}
              </td>

              {/* 2. Quick Contact (WhatsApp & Call) */}
              <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => handleWhatsApp(row.phone)}
                    className="p-1.5 sm:py-1.5 sm:px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] shadow-2xs transition-all flex items-center gap-1"
                    title="WhatsApp Chat"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleCall(row.phone)}
                    className="p-1.5 sm:py-1.5 sm:px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-2xs transition-all flex items-center gap-1"
                    title="Call Phone"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Call</span>
                  </button>
                </div>
              </td>

              {/* 3. 3 Dots Action Button */}
              <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 whitespace-nowrap text-center">
                <button
                  onClick={() => onMore(row)}
                  className="p-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-700 transition-all font-bold text-xs inline-flex items-center justify-center"
                  title="More details & options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
