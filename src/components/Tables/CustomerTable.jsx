import React from 'react';
import { MessageSquare, PhoneCall, MoreVertical, UserCheck, CheckCircle2, Clock } from 'lucide-react';

export default function CustomerTable({ data, onMore, onStatusChange }) {
  const handleWhatsApp = (phone) => {
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    window.open(`https://wa.me/91${cleanPhone}`, '_blank');
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleToggleStatus = (row) => {
    const nextStatus = row.status === 'Success' ? 'Pending' : 'Success';
    if (onStatusChange) {
      onStatusChange(row.id, nextStatus);
    }
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
            <th className="py-3.5 px-4">Customer Name</th>
            <th className="py-3.5 px-4">Aadhaar Number</th>
            <th className="py-3.5 px-4 text-center">Status</th>
            <th className="py-3.5 px-4 text-center">Quick Contact</th>
            <th className="py-3.5 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-800">
          {data.map((row) => {
            const isSuccess = row.status === 'Success';

            return (
              <tr key={row.id} className="hover:bg-green-50/30 transition-colors">
                {/* 1. Customer Name */}
                <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900">
                  {row.name}
                </td>

                {/* 2. Aadhaar Number */}
                <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-600">
                  {row.aadhaar || '-'}
                </td>

                {/* 3. Status (1-Click Direct Toggle) */}
                <td className="py-3.5 px-4 whitespace-nowrap text-center">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(row)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer shadow-xs active:scale-95 ${
                      isSuccess
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                        : 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                    }`}
                    title="Click to toggle status"
                  >
                    {isSuccess ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Success</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pending</span>
                      </>
                    )}
                  </button>
                </td>

                {/* 4. Quick Contact (WhatsApp & Call) */}
                <td className="py-3.5 px-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleWhatsApp(row.phone)}
                      className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1.5 px-3 rounded-xl text-[11px] shadow-xs transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleCall(row.phone)}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-xl text-[11px] shadow-xs transition-all"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Call</span>
                    </button>
                  </div>
                </td>

                {/* 5. 3 Dots (More Action Menu) */}
                <td className="py-3.5 px-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => onMore(row)}
                    className="p-2 rounded-2xl bg-slate-100 text-slate-700 hover:bg-green-100 hover:text-green-700 transition-all font-bold text-xs inline-flex items-center justify-center"
                    title="More details & options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
