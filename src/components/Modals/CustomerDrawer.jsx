import React from 'react';
import { X, User, Phone, FileText, Calendar, Clock, ExternalLink, MessageSquare, PhoneCall, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function CustomerDrawer({ customer, onClose, onPreviewDoc, onEdit, onDelete }) {
  if (!customer) return null;

  const handleWhatsApp = () => {
    const cleanPhone = customer.phone ? customer.phone.replace(/\D/g, '') : '';
    window.open(`https://wa.me/91${cleanPhone}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${customer.phone}`;
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'Delete Customer Record?',
      text: `Are you sure you want to delete customer records for ${customer.name}?`,
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
      if (result.isConfirmed && onDelete) {
        onDelete(customer.id);
        onClose();
      }
    });
  };

  const isSuccess = customer.status === 'Success';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-left">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center font-bold text-lg">
              {customer.name ? customer.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{customer.name || 'Customer Details'}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSuccess ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isSuccess ? 'Success ✅' : 'Pending ⏳'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Quick Contact Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-2xl text-xs transition-all shadow-md shadow-emerald-500/20"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleCall}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-2xl text-xs transition-all shadow-md shadow-blue-600/20"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Now</span>
            </button>
          </div>

          {/* Details List */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <User className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">Customer Name</div>
                <div className="text-sm font-bold text-slate-800">{customer.name || 'N/A'}</div>
              </div>
            </div>

            {customer.phone && (
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Phone Number</div>
                  <div className="text-sm font-bold text-slate-800">{customer.phone}</div>
                </div>
              </div>
            )}

            {customer.aadhaar && (
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Aadhaar Number</div>
                  <div className="text-sm font-bold text-slate-800 font-mono">{customer.aadhaar}</div>
                </div>
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Status</div>
              <div className="text-xs font-bold text-slate-800">
                {isSuccess ? 'Success (Completed)' : 'Pending (In Progress)'}
              </div>
            </div>
          </div>

          {/* Uploaded Documents List */}
          {customer.driveUrls && customer.driveUrls.length > 0 ? (
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Uploaded Documents ({customer.driveUrls.length})
              </h3>
              <div className="space-y-2">
                {customer.driveUrls.map((url, idx) => {
                  const name = (customer.fileNames && customer.fileNames[idx]) || `Document_${idx + 1}`;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-2xl bg-green-50/60 border border-green-200/60 text-xs font-semibold"
                    >
                      <span className="truncate max-w-[180px] text-green-900">{name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onPreviewDoc && onPreviewDoc(url, name)}
                          className="bg-green-600 text-white px-2.5 py-1 rounded-xl text-[11px] font-bold hover:bg-green-700 transition-all"
                        >
                          View
                        </button>
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 text-green-700 hover:text-green-900"
                          title="Open Drive Link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-400">
              No attached document files.
            </div>
          )}

          {/* Edit & Delete Actions inside 3 Dots Drawer */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                if (onEdit) onEdit(customer);
                onClose();
              }}
              className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-2xl text-xs transition-all"
            >
              <Edit2 className="w-4 h-4 text-green-600" />
              <span>Edit Details</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-4 rounded-2xl text-xs transition-all border border-red-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl text-xs transition-all"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
