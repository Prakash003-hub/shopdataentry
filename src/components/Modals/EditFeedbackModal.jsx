import React, { useState } from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import { apiUpdateFeedback } from '../../services/api';
import Swal from 'sweetalert2';

export default function EditFeedbackModal({ item, onClose, onUpdated }) {
  if (!item) return null;

  const [name, setName] = useState(item.name || '');
  const [phone, setPhone] = useState(item.phone || '');
  const [service, setService] = useState(item.service || '');
  const [description, setDescription] = useState(item.description || '');
  const [date, setDate] = useState(item.date || new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !service) {
      Swal.fire({ icon: 'warning', title: 'Fields Required', text: 'Name, Phone, and Service are required.' });
      return;
    }

    setSubmitting(true);
    const res = await apiUpdateFeedback({
      id: item.id,
      name,
      phone,
      service,
      description,
      date,
    });

    setSubmitting(false);

    if (res.success) {
      Swal.fire({
        icon: 'success',
        title: 'Feedback Updated!',
        text: 'Customer feedback updated successfully.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
      });
      onUpdated();
      onClose();
    } else {
      Swal.fire({ icon: 'error', title: 'Update Failed', text: res.message || 'Failed to update.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center font-bold">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Edit Customer Feedback</h2>
            <p className="text-xs text-slate-500">Modify customer feedback details and update Google Sheets</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-semibold text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-semibold text-slate-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Service Name</label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-semibold text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description / Notes</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-semibold text-slate-800"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-2xl text-sm transition-all shadow-md shadow-green-600/30 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Updating...' : 'Update Feedback'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-2xl text-sm transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
