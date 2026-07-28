import React, { useState } from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import { apiUpdateBudget } from '../../services/api';
import Swal from 'sweetalert2';

export default function EditBudgetModal({ item, onClose, onUpdated }) {
  if (!item) return null;

  const incomeCategories = [
    'Xerox',
    'AEPS',
    'Printout',
    'e-Sevai',
    'Aadhaar',
    'Voter ID',
    'PAN',
    'Other',
  ];

  const isCustomCategory = item.category && !incomeCategories.includes(item.category);

  const [type, setType] = useState(item.type || 'Income');
  const [amount, setAmount] = useState(item.amount || '');
  const [category, setCategory] = useState(isCustomCategory ? 'Other' : item.category || 'Xerox');
  const [customCategory, setCustomCategory] = useState(isCustomCategory ? item.category : '');
  const [description, setDescription] = useState(item.description || '');
  const [date, setDate] = useState(item.date || new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      Swal.fire({ icon: 'warning', title: 'Amount Required', text: 'Please enter a valid amount.' });
      return;
    }

    setSubmitting(true);
    const finalCategory = type === 'Income' ? (category === 'Other' ? customCategory : category) : '';

    const res = await apiUpdateBudget({
      id: item.id,
      type,
      amount: parseFloat(amount),
      category: finalCategory,
      description,
      date,
    });

    setSubmitting(false);

    if (res.success) {
      Swal.fire({
        icon: 'success',
        title: 'Entry Updated!',
        text: 'Budget record updated successfully.',
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
            <h2 className="text-lg font-bold text-slate-900">Edit Budget Transaction</h2>
            <p className="text-xs text-slate-500">Modify entry details and update Google Sheets</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Transaction Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-semibold text-slate-800"
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
                <option value="Investment">Investment</option>
                <option value="Fund">Fund</option>
                <option value="Starting Amount">Starting Amount</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-extrabold text-slate-900"
                required
              />
            </div>
          </div>

          {type === 'Income' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Income Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-semibold text-slate-800"
                >
                  {incomeCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {category === 'Other' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Custom Category Name</label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-medium text-slate-800"
                  />
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description / Purpose</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Transaction Date</label>
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
              <span>{submitting ? 'Updating...' : 'Update Entry'}</span>
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
