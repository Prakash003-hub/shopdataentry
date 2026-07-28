import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import {
  DollarSign,
  UserCheck,
  Save,
  Trash2,
  Edit3,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  apiAddBudget,
  apiGetBudgetList,
  apiDeleteBudget,
  apiAddFeedback,
  apiAddCustomer,
  apiUploadFiles,
} from '../services/api';
import Swal from 'sweetalert2';

import { getLocalDateString } from '../utils/dateUtils';

export default function DataEntry() {
  const [activeModule, setActiveModule] = useState('budget'); // 'budget' | 'customer'
  const [customerTab, setCustomerTab] = useState('feedback'); // 'feedback' | 'data'

  // --- MODULE 1: BUDGET FORM STATE ---
  const [bType, setBType] = useState('Income');
  const [bAmount, setBAmount] = useState('');
  const [bCategory, setBCategory] = useState('Xerox');
  const [bCustomCategory, setBCustomCategory] = useState('');
  const [bDescription, setBDescription] = useState('');
  const [bDate, setBDate] = useState(getLocalDateString());
  const [bSubmitting, setBSubmitting] = useState(false);
  const [todayBudgets, setTodayBudgets] = useState([]);

  // --- MODULE 2: CUSTOMER FEEDBACK FORM STATE ---
  const [fName, setFName] = useState('');
  const [fPhone, setFPhone] = useState('');
  const [fService, setFService] = useState('');
  const [fDescription, setFDescription] = useState('');
  const [fDate, setFDate] = useState(getLocalDateString());
  const [fSubmitting, setFSubmitting] = useState(false);

  // --- MODULE 2: CUSTOMER DATA FORM STATE ---
  const [cName, setCName] = useState('');
  const [cAadhaar, setCAadhaar] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cStatus, setCStatus] = useState('Pending');
  const [cFiles, setCFiles] = useState([]);
  const [cSubmitting, setCSubmitting] = useState(false);

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

  useEffect(() => {
    loadTodayBudgets();
  }, []);

  const loadTodayBudgets = async () => {
    const list = await apiGetBudgetList();
    const today = getLocalDateString();
    setTodayBudgets((list || []).filter((item) => item.date === today));
  };

  // --- SUBMIT BUDGET ---
  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    if (!bAmount || parseFloat(bAmount) <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Amount Required',
        text: 'Please enter a valid transaction amount.',
        confirmButtonColor: '#16a34a',
      });
      return;
    }

    setBSubmitting(true);
    const finalCategory =
      bType === 'Income' ? (bCategory === 'Other' ? bCustomCategory : bCategory) : '';

    const res = await apiAddBudget({
      type: bType,
      amount: bAmount,
      category: finalCategory,
      description: bDescription,
      date: bDate,
    });

    setBSubmitting(false);

    if (res.success) {
      Swal.fire({
        icon: 'success',
        title: 'Transaction Saved!',
        text: `${bType} entry of ₹${bAmount} saved successfully.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
      });

      // Reset Form
      setBAmount('');
      setBDescription('');
      setBCustomCategory('');
      loadTodayBudgets();
    }
  };

  // --- DELETE TODAY BUDGET ---
  const handleDeleteBudget = async (id) => {
    Swal.fire({
      title: 'Delete Entry?',
      text: 'Are you sure you want to delete this transaction?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await apiDeleteBudget(id);
        loadTodayBudgets();
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  // --- SUBMIT CUSTOMER FEEDBACK ---
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!fName || !fPhone || !fService) {
      Swal.fire({
        icon: 'warning',
        title: 'Fields Required',
        text: 'Please enter Customer Name, Phone, and Service Name.',
        confirmButtonColor: '#16a34a',
      });
      return;
    }

    setFSubmitting(true);
    const res = await apiAddFeedback({
      name: fName,
      phone: fPhone,
      service: fService,
      description: fDescription,
      date: fDate,
    });
    setFSubmitting(false);

    if (res.success) {
      Swal.fire({
        icon: 'success',
        title: 'Feedback Saved!',
        text: 'Customer feedback logged successfully.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
      });

      setFName('');
      setFPhone('');
      setFService('');
      setFDescription('');
    }
  };

  // --- SUBMIT CUSTOMER DATA (WITH DRIVE FILE UPLOAD) ---
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    if (!cName || !cPhone) {
      Swal.fire({
        icon: 'warning',
        title: 'Fields Required',
        text: 'Please enter Customer Name and Phone Number.',
        confirmButtonColor: '#16a34a',
      });
      return;
    }

    setCSubmitting(true);
    let uploadedFiles = [];
    if (cFiles.length > 0) {
      uploadedFiles = await apiUploadFiles(cFiles);
    }

    const driveFileIds = uploadedFiles.map((f) => f.fileId);
    const driveUrls = uploadedFiles.map((f) => f.driveLink);
    const fileNames = uploadedFiles.map((f) => f.fileName);

    const res = await apiAddCustomer({
      name: cName,
      aadhaar: cAadhaar,
      phone: cPhone,
      status: cStatus,
      driveFileIds,
      driveUrls,
      fileNames,
    });

    setCSubmitting(false);

    if (res.success) {
      Swal.fire({
        icon: 'success',
        title: 'Customer Data Saved!',
        text: 'Customer records & Google Drive files stored successfully.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
      });

      setCName('');
      setCAadhaar('');
      setCPhone('');
      setCStatus('Pending');
      setCFiles([]);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Top Module Switching Tabs */}
      <div className="flex bg-slate-200/80 p-1.5 rounded-3xl gap-2 max-w-md mx-auto">
        <button
          onClick={() => setActiveModule('budget')}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeModule === 'budget'
              ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Shop Budget Entry</span>
        </button>
        <button
          onClick={() => setActiveModule('customer')}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeModule === 'customer'
              ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Customer Service</span>
        </button>
      </div>

      {/* MODULE 1: SHOP BUDGET CALCULATION */}
      {activeModule === 'budget' && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl max-w-3xl mx-auto border border-slate-200/80">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Shop Budget Calculation</h2>
                <p className="text-xs text-slate-500">
                  Every entry is stored immediately into Google Sheets with running balance.
                </p>
              </div>
            </div>

            <form onSubmit={handleBudgetSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Transaction Type Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Transaction Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={bType}
                    onChange={(e) => setBType(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-semibold text-slate-800"
                  >
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                    <option value="Investment">Investment</option>
                    <option value="Fund">Fund</option>
                    <option value="Starting Amount">Starting Amount</option>
                  </select>
                </div>

                {/* Amount Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Enter amount"
                    value={bAmount}
                    onChange={(e) => setBAmount(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-extrabold text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Income Category Dropdown (Only visible for Income) */}
              {bType === 'Income' && (
                <div className="animate-fade-in space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Income Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={bCategory}
                      onChange={(e) => setBCategory(e.target.value)}
                      className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-semibold text-slate-800"
                    >
                      {incomeCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {bCategory === 'Other' && (
                    <div className="animate-fade-in">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Specify Other Category Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter custom category"
                        value={bCustomCategory}
                        onChange={(e) => setBCustomCategory(e.target.value)}
                        className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-medium text-slate-800"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Description (Visible for Investment, Expense, Fund) */}
              {(bType === 'Investment' || bType === 'Expense' || bType === 'Fund') && (
                <div className="animate-fade-in">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description / Purpose (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter details or transaction notes"
                    value={bDescription}
                    onChange={(e) => setBDescription(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-medium text-slate-800"
                  />
                </div>
              )}

              {/* Date Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Transaction Date
                </label>
                <input
                  type="date"
                  value={bDate}
                  onChange={(e) => setBDate(e.target.value)}
                  className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-semibold text-slate-800"
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={bSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span>{bSubmitting ? 'Saving Transaction...' : 'Save Transaction'}</span>
              </button>
            </form>
          </div>

          {/* Today's Entries Realtime List */}
          <div className="glass-card p-6 rounded-3xl max-w-3xl mx-auto border border-slate-200/80">
            <h3 className="font-bold text-slate-800 text-sm mb-4">
              Today's Entries ({todayBudgets.length})
            </h3>

            {todayBudgets.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                No entries added today yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {todayBudgets.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{item.type}</span>
                        {item.category && (
                          <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{item.description || 'No notes'}</div>
                      <div className="text-sm font-extrabold text-slate-900 mt-1">
                        ₹{Number(item.amount).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteBudget(item.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODULE 2: CUSTOMER SERVICE ENTRY */}
      {activeModule === 'customer' && (
        <div className="glass-card p-6 rounded-3xl max-w-3xl mx-auto border border-slate-200/80">
          {/* Sub Tab Navigation */}
          <div className="flex border-b border-slate-100 mb-6 gap-6">
            <button
              onClick={() => setCustomerTab('feedback')}
              className={`pb-3 font-bold text-xs transition-all border-b-2 ${
                customerTab === 'feedback'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Tab 1: Customer Feedback
            </button>
            <button
              onClick={() => setCustomerTab('data')}
              className={`pb-3 font-bold text-xs transition-all border-b-2 ${
                customerTab === 'data'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Tab 2: Customer Data (Drive Upload)
            </button>
          </div>

          {/* TAB 1: CUSTOMER FEEDBACK FORM */}
          {customerTab === 'feedback' && (
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter customer name"
                    value={fName}
                    onChange={(e) => setFName(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-semibold text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={fPhone}
                    onChange={(e) => setFPhone(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-semibold text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aadhaar Print, PAN Card, Xerox"
                  value={fService}
                  onChange={(e) => setFService(e.target.value)}
                  className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-semibold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Feedback Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter details or notes regarding customer request"
                  value={fDescription}
                  onChange={(e) => setFDescription(e.target.value)}
                  className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={fDate}
                  onChange={(e) => setFDate(e.target.value)}
                  className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-semibold text-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={fSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span>{fSubmitting ? 'Saving Feedback...' : 'Save Feedback'}</span>
              </button>
            </form>
          )}

          {/* TAB 2: CUSTOMER DATA FORM (DRIVE FILE UPLOADS) */}
          {customerTab === 'data' && (
            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter customer full name"
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-semibold text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    maxLength={14}
                    placeholder="xxxx xxxx xxxx"
                    value={cAadhaar}
                    onChange={(e) => setCAadhaar(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-mono font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={cPhone}
                    onChange={(e) => setCPhone(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-semibold text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={cStatus}
                    onChange={(e) => setCStatus(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-2xl text-sm font-semibold text-slate-800"
                  >
                    <option value="Pending">Pending ⏳</option>
                    <option value="Success">Success ✅</option>
                  </select>
                </div>
              </div>

              {/* Multi-File Upload Dropzone Component */}
              <FileUpload files={cFiles} setFiles={setCFiles} disabled={cSubmitting} />

              <button
                type="submit"
                disabled={cSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span>{cSubmitting ? 'Uploading to Drive & Saving...' : 'Save Customer Data & Upload'}</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
