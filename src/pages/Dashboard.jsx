import React, { useState, useEffect } from 'react';
import StatCard from '../components/Cards/StatCard';
import DailyTrendChart from '../components/Charts/DailyTrendChart';
import CategoryPieChart from '../components/Charts/CategoryPieChart';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Briefcase,
  PiggyBank,
  Receipt,
  Users,
  MessageSquare,
  ArrowUpRight,
  PlusCircle,
} from 'lucide-react';
import { apiGetBudgetList, apiGetCustomerList, apiGetFeedbackList } from '../services/api';
import { useNavigate } from 'react-router-dom';

import { getLocalDateString } from '../utils/dateUtils';
import { processBudgetRecords } from '../utils/budgetUtils';

export default function Dashboard() {
  const navigate = useNavigate();
  const [budgetList, setBudgetList] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [budgets, customers, feedbacks] = await Promise.all([
      apiGetBudgetList(),
      apiGetCustomerList(),
      apiGetFeedbackList(),
    ]);

    setBudgetList(budgets || []);
    setCustomerCount((customers || []).length);
    setFeedbackCount((feedbacks || []).length);
    setLoading(false);
  };

  const {
    processedList,
    currentBalance,
    todayIncome,
    todayExpense,
    todayInvestment,
    todayFund,
    todayTransactions,
  } = processBudgetRecords(budgetList);

  const todayStr = getLocalDateString();
  const todayEntries = processedList.filter((b) => b.date === todayStr);

  // Group trend chart data for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return getLocalDateString(d);
  });

  const dailyTrendData = last7Days.map((dateKey) => {
    const dayRecords = processedList.filter((b) => b.date === dateKey);
    const inc = dayRecords
      .filter((b) => b.type === 'Income')
      .reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
    const exp = dayRecords
      .filter((b) => b.type === 'Expense')
      .reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
    return {
      date: dateKey.slice(5), // MM-DD
      Income: inc,
      Expense: exp,
    };
  });

  // Group pie chart data by Category for Income
  const categoryMap = {};
  budgetList
    .filter((b) => b.type === 'Income' && b.category)
    .forEach((b) => {
      categoryMap[b.category] = (categoryMap[b.category] || 0) + (parseFloat(b.amount) || 0);
    });

  const categoryPieData = Object.keys(categoryMap).map((cat) => ({
    name: cat,
    value: categoryMap[cat],
  }));

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-3xl bg-gradient-to-r from-green-600 to-emerald-600 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl shadow-green-600/20">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Overview Dashboard</h2>
          <p className="text-xs text-green-100 mt-1 font-medium">
            Realtime shop budget metrics, running balance, and customer statistics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/data-entry')}
            className="bg-white text-green-700 hover:bg-green-50 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Transaction</span>
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Balance"
          value={currentBalance}
          icon={Wallet}
          color="green"
          subtitle="Running balance formula total"
        />
        <StatCard
          title="Today's Income"
          value={todayIncome}
          icon={TrendingUp}
          color="emerald"
          subtitle={`${todayEntries.filter((b) => b.type === 'Income').length} entries today`}
        />
        <StatCard
          title="Today's Expense"
          value={todayExpense}
          icon={TrendingDown}
          color="red"
          subtitle={`${todayEntries.filter((b) => b.type === 'Expense').length} entries today`}
        />
        <StatCard
          title="Today's Investment"
          value={todayInvestment}
          icon={Briefcase}
          color="purple"
          subtitle="Capital / Inventory"
        />
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Fund"
          value={todayFund}
          icon={PiggyBank}
          color="amber"
          subtitle="Reserve funds added"
        />
        <StatCard
          title="Today's Transactions"
          value={todayEntries.length}
          icon={Receipt}
          color="blue"
          subtitle="Total transactions recorded"
        />
        <StatCard
          title="Total Customers"
          value={customerCount}
          icon={Users}
          color="indigo"
          subtitle="Registered customer profiles"
        />
        <StatCard
          title="Total Feedback"
          value={feedbackCount}
          icon={MessageSquare}
          color="amber"
          subtitle="Feedback entries logged"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-sm">7-Day Income vs Expense</h3>
            <span className="text-[11px] font-bold text-slate-400">Daily Trend</span>
          </div>
          <DailyTrendChart data={dailyTrendData} />
        </div>

        <div className="glass-card p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Category-wise Income</h3>
            <span className="text-[11px] font-bold text-slate-400">Income Breakdown</span>
          </div>
          <CategoryPieChart data={categoryPieData} />
        </div>
      </div>

      {/* Today's Recent Entries List */}
      <div className="glass-card p-6 rounded-3xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-sm">Today's Transactions ({todayEntries.length})</h3>
          <button
            onClick={() => navigate('/data-view')}
            className="text-xs font-bold text-green-600 hover:text-green-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {todayEntries.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs font-semibold">
            No entries recorded for today yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {todayEntries.map((row) => (
              <div key={row.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{row.type}</span>
                    {row.category && (
                      <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">
                        {row.category}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{row.description || 'No description'}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-slate-900">
                    ₹{Number(row.amount).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold">{row.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
