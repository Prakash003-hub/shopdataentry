import React, { useState, useEffect } from 'react';
import BudgetTable from '../components/Tables/BudgetTable';
import FeedbackTable from '../components/Tables/FeedbackTable';
import CustomerTable from '../components/Tables/CustomerTable';
import CustomerDrawer from '../components/Modals/CustomerDrawer';
import DocumentPreviewModal from '../components/Modals/DocumentPreviewModal';
import EditBudgetModal from '../components/Modals/EditBudgetModal';
import EditFeedbackModal from '../components/Modals/EditFeedbackModal';
import EditCustomerModal from '../components/Modals/EditCustomerModal';
import DailyTrendChart from '../components/Charts/DailyTrendChart';
import CategoryPieChart from '../components/Charts/CategoryPieChart';
import { exportToCSV, printReport } from '../services/exportUtils';
import { getLocalDateString } from '../utils/dateUtils';
import { processBudgetRecords } from '../utils/budgetUtils';
import {
  apiGetBudgetList,
  apiDeleteBudget,
  apiGetFeedbackList,
  apiDeleteFeedback,
  apiGetCustomerList,
  apiDeleteCustomer,
} from '../services/api';
import {
  Download,
  Printer,
  Search,
  Filter,
  Calendar,
  DollarSign,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function DataView() {
  const [activeModule, setActiveModule] = useState('budget'); // 'budget' | 'customer'
  const [customerTab, setCustomerTab] = useState('feedback'); // 'feedback' | 'data'

  // --- DATA STATES ---
  const [budgets, setBudgets] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- EDIT MODAL STATES ---
  const [editingBudget, setEditingBudget] = useState(null);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // --- FILTERS & SEARCH ---
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('today'); // 'today' | 'yesterday' | 'week' | 'month' | 'custom' | 'all'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // --- PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- MODALS & DRAWERS ---
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    const [bData, fData, cData] = await Promise.all([
      apiGetBudgetList(),
      apiGetFeedbackList(),
      apiGetCustomerList(),
    ]);

    setBudgets(bData || []);
    setFeedbacks(fData || []);
    setCustomers(cData || []);
    setLoading(false);
  };

  // Process budgets for exact running balance calculations
  const { processedList, currentBalance } = processBudgetRecords(budgets);

  // --- BUDGET FILTERING LOGIC ---
  const getFilteredBudgets = () => {
    return processedList.filter((b) => {
      // Search
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        (b.description && b.description.toLowerCase().includes(query)) ||
        (b.category && b.category.toLowerCase().includes(query)) ||
        (b.type && b.type.toLowerCase().includes(query));

      // Type Filter
      const matchesType = typeFilter === 'all' || b.type === typeFilter;

      // Category Filter
      const matchesCategory = categoryFilter === 'all' || b.category === categoryFilter;

      // Date Range Filtering
      let matchesDate = true;
      const rowDate = new Date(b.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dateFilter === 'today') {
        matchesDate = b.date === getLocalDateString();
      } else if (dateFilter === 'yesterday') {
        const yest = new Date(today);
        yest.setDate(yest.getDate() - 1);
        matchesDate = b.date === getLocalDateString(yest);
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = rowDate >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        matchesDate = rowDate >= monthAgo;
      } else if (dateFilter === 'custom') {
        if (startDate && endDate) {
          matchesDate = b.date >= startDate && b.date <= endDate;
        }
      }

      return matchesSearch && matchesType && matchesCategory && matchesDate;
    });
  };

  const filteredBudgets = getFilteredBudgets();

  // Summary Totals
  const totalIncome = filteredBudgets
    .filter((b) => b.type === 'Income')
    .reduce((s, b) => s + (parseFloat(b.amount) || 0), 0);

  const totalExpense = filteredBudgets
    .filter((b) => b.type === 'Expense')
    .reduce((s, b) => s + (parseFloat(b.amount) || 0), 0);

  const totalInvestment = filteredBudgets
    .filter((b) => b.type === 'Investment')
    .reduce((s, b) => s + (parseFloat(b.amount) || 0), 0);

  const totalFund = filteredBudgets
    .filter((b) => b.type === 'Fund')
    .reduce((s, b) => s + (parseFloat(b.amount) || 0), 0);

  // Pagination for Budget Table
  const totalPages = Math.ceil(filteredBudgets.length / itemsPerPage) || 1;
  const paginatedBudgets = filteredBudgets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- CUSTOMER FEEDBACK & DATA FILTERING LOGIC ---
  const filteredFeedbacks = feedbacks.filter((f) => {
    const q = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      (f.name && f.name.toLowerCase().includes(q)) ||
      (f.phone && f.phone.includes(q)) ||
      (f.service && f.service.toLowerCase().includes(q))
    );
  });

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.aadhaar && c.aadhaar.includes(q))
    );
  });

  // Export & Print Handlers
  const handleExportCSV = () => {
    if (activeModule === 'budget') {
      exportToCSV(filteredBudgets, `budget_report_${new Date().toISOString().split('T')[0]}.csv`);
    } else if (customerTab === 'feedback') {
      exportToCSV(filteredFeedbacks, `customer_feedback_${new Date().toISOString().split('T')[0]}.csv`);
    } else {
      exportToCSV(filteredCustomers, `customer_data_${new Date().toISOString().split('T')[0]}.csv`);
    }
  };

  const handlePrint = () => {
    printReport(`SUBI Report - ${activeModule.toUpperCase()}`);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Top Module Navigation */}
      <div className="flex bg-slate-200/80 p-1.5 rounded-3xl gap-2 max-w-md mx-auto no-print">
        <button
          onClick={() => setActiveModule('budget')}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeModule === 'budget'
              ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Shop Budget View</span>
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
          <span>Customer Service View</span>
        </button>
      </div>

      {/* MODULE 1: SHOP BUDGET VIEW */}
      {activeModule === 'budget' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="glass-card p-4 rounded-3xl border border-slate-200/80 space-y-4 no-print">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search category or notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full glass-input pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 rounded-2xl"
                />
              </div>

              {/* Action Buttons: Export CSV & Print */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3.5 rounded-2xl text-xs transition-all shadow-md shadow-emerald-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-3.5 rounded-2xl text-xs transition-all shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Filter Dropdowns & Range Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Date Preset</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full glass-input px-3 py-2 text-xs font-semibold text-slate-800 rounded-xl"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom Range</option>
                  <option value="all">All Dates</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full glass-input px-3 py-2 text-xs font-semibold text-slate-800 rounded-xl"
                >
                  <option value="all">All Types</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                  <option value="Investment">Investment</option>
                  <option value="Fund">Fund</option>
                  <option value="Starting Amount">Starting Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full glass-input px-3 py-2 text-xs font-semibold text-slate-800 rounded-xl"
                >
                  <option value="all">All Categories</option>
                  <option value="Xerox">Xerox</option>
                  <option value="AEPS">AEPS</option>
                  <option value="Printout">Printout</option>
                  <option value="e-Sevai">e-Sevai</option>
                  <option value="Aadhaar">Aadhaar</option>
                  <option value="Voter ID">Voter ID</option>
                  <option value="PAN">PAN</option>
                </select>
              </div>
            </div>

            {dateFilter === 'custom' && (
              <div className="flex gap-3 pt-1 animate-fade-in">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="glass-input px-3 py-2 text-xs font-semibold text-slate-800 rounded-xl"
                />
                <span className="self-center text-xs font-bold text-slate-400">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="glass-input px-3 py-2 text-xs font-semibold text-slate-800 rounded-xl"
                />
              </div>
            )}
          </div>

          {/* Budget Data Table */}
          <BudgetTable
            data={paginatedBudgets}
            onEdit={(row) => setEditingBudget(row)}
            onDelete={async (id) => {
              await apiDeleteBudget(id);
              loadAllData();
            }}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-2 glass-card rounded-2xl no-print">
              <span className="text-xs font-bold text-slate-500">
                Page {currentPage} of {totalPages} ({filteredBudgets.length} entries)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-xl bg-slate-100 disabled:opacity-40 hover:bg-slate-200 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-xl bg-slate-100 disabled:opacity-40 hover:bg-slate-200 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Bottom Summary Totals Box */}
          <div className="glass-card p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Bottom Totals Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-bold text-emerald-400 block mb-1">Total Income</span>
                <span className="text-lg font-extrabold">₹{totalIncome.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-bold text-red-400 block mb-1">Total Expense</span>
                <span className="text-lg font-extrabold">₹{totalExpense.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-bold text-purple-400 block mb-1">Total Investment</span>
                <span className="text-lg font-extrabold">₹{totalInvestment.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-bold text-amber-400 block mb-1">Total Fund</span>
                <span className="text-lg font-extrabold">₹{totalFund.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 border border-green-500 shadow-md col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-white block mb-1">Current Balance</span>
                <span className="text-xl font-extrabold">₹{currentBalance.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: CUSTOMER SERVICE VIEW */}
      {activeModule === 'customer' && (
        <div className="space-y-6">
          {/* Sub Tab Buttons */}
          <div className="flex border-b border-slate-200/80 max-w-md mx-auto gap-6 no-print">
            <button
              onClick={() => setCustomerTab('feedback')}
              className={`pb-3 font-bold text-xs transition-all border-b-2 ${
                customerTab === 'feedback'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Customer Feedback Table ({filteredFeedbacks.length})
            </button>
            <button
              onClick={() => setCustomerTab('data')}
              className={`pb-3 font-bold text-xs transition-all border-b-2 ${
                customerTab === 'data'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Customer Data Table ({filteredCustomers.length})
            </button>
          </div>

          {/* Search & Actions Header */}
          <div className="flex items-center justify-between gap-3 glass-card p-4 rounded-3xl border border-slate-200/80 no-print">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search name, phone, service or Aadhaar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full glass-input pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 rounded-2xl"
              />
            </div>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3.5 rounded-2xl text-xs transition-all shadow-md shrink-0"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>

          {/* TAB 1: FEEDBACK TABLE */}
          {customerTab === 'feedback' && (
            <FeedbackTable
              data={filteredFeedbacks}
              onMore={(customer) => setSelectedCustomer(customer)}
              onEdit={(row) => setEditingFeedback(row)}
              onDelete={async (id) => {
                await apiDeleteFeedback(id);
                loadAllData();
              }}
            />
          )}

          {/* TAB 2: CUSTOMER DATA TABLE */}
          {customerTab === 'data' && (
            <CustomerTable
              data={filteredCustomers}
              onMore={(customer) => setSelectedCustomer(customer)}
              onPreviewDoc={(url, name) => setPreviewDoc({ url, name })}
              onEdit={(row) => setEditingCustomer(row)}
              onStatusChange={async (id, newStatus) => {
                // Optimistic UI state update (Instant 0ms screen change)
                setCustomers((prev) =>
                  prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
                );

                const res = await apiUpdateCustomer({ id, status: newStatus });
                if (res && res.success) {
                  Swal.fire({
                    icon: 'success',
                    title: `Status set to ${newStatus}`,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                  });
                } else {
                  // Revert if API failed
                  setCustomers((prev) =>
                    prev.map((c) => (c.id === id ? { ...c, status: newStatus === 'Success' ? 'Pending' : 'Success' } : c))
                  );
                  Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: (res && res.message) || 'Could not update status on Google Sheets.',
                  });
                }
              }}
              onDelete={async (id) => {
                await apiDeleteCustomer(id);
                loadAllData();
              }}
            />
          )}
        </div>
      )}

      {/* Customer Detail Drawer (3 Dots Menu) */}
      {selectedCustomer && (
        <CustomerDrawer
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onPreviewDoc={(url, name) => setPreviewDoc({ url, name })}
          onEdit={(row) => setEditingCustomer(row)}
          onDelete={async (id) => {
            await apiDeleteCustomer(id);
            loadAllData();
          }}
        />
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <DocumentPreviewModal
          docUrl={previewDoc.url}
          docName={previewDoc.name}
          onClose={() => setPreviewDoc(null)}
        />
      )}

      {/* Edit Budget Modal */}
      {editingBudget && (
        <EditBudgetModal
          item={editingBudget}
          onClose={() => setEditingBudget(null)}
          onUpdated={loadAllData}
        />
      )}

      {/* Edit Feedback Modal */}
      {editingFeedback && (
        <EditFeedbackModal
          item={editingFeedback}
          onClose={() => setEditingFeedback(null)}
          onUpdated={loadAllData}
        />
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <EditCustomerModal
          item={editingCustomer}
          onClose={() => setEditingCustomer(null)}
          onUpdated={loadAllData}
        />
      )}
    </div>
  );
}
