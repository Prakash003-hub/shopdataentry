import React, { useState } from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import FileUpload from '../FileUpload';
import { apiUpdateCustomer, apiUploadFiles } from '../../services/api';
import Swal from 'sweetalert2';

export default function EditCustomerModal({ item, onClose, onUpdated }) {
  if (!item) return null;

  const [name, setName] = useState(item.name || '');
  const [aadhaar, setAadhaar] = useState(item.aadhaar || '');
  const [phone, setPhone] = useState(item.phone || '');
  const [newFiles, setNewFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      Swal.fire({ icon: 'warning', title: 'Fields Required', text: 'Customer Name and Phone are required.' });
      return;
    }

    setSubmitting(true);

    let driveFileIds = item.driveFileIds || [];
    let driveUrls = item.driveUrls || [];
    let fileNames = item.fileNames || [];

    if (newFiles.length > 0) {
      try {
        const uploaded = await apiUploadFiles(newFiles);
        const uploadedIds = uploaded.map((f) => f.fileId);
        const uploadedUrls = uploaded.map((f) => f.driveLink);
        const uploadedNames = uploaded.map((f) => f.fileName);

        driveFileIds = [...driveFileIds, ...uploadedIds];
        driveUrls = [...driveUrls, ...uploadedUrls];
        fileNames = [...fileNames, ...uploadedNames];
      } catch (err) {
        setSubmitting(false);
        Swal.fire({ icon: 'error', title: 'Upload Error', text: 'Failed to upload new document files.' });
        return;
      }
    }

    const res = await apiUpdateCustomer({
      id: item.id,
      name,
      aadhaar,
      phone,
      status,
      driveFileIds,
      driveUrls,
      fileNames,
    });

    setSubmitting(false);

    if (res.success) {
      Swal.fire({
        icon: 'success',
        title: 'Customer Data Updated!',
        text: 'Customer records updated successfully in Google Sheets.',
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
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
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
            <h2 className="text-lg font-bold text-slate-900">Edit Customer Data</h2>
            <p className="text-xs text-slate-500">Modify profile & documents in Google Sheets</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Customer Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-semibold text-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Aadhaar Number</label>
              <input
                type="text"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-mono font-semibold text-slate-800"
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

          {/* Add Additional Documents */}
          <div className="pt-2">
            <FileUpload files={newFiles} setFiles={setNewFiles} disabled={submitting} />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-2xl text-sm transition-all shadow-md shadow-green-600/30 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Updating...' : 'Update Customer Record'}</span>
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
