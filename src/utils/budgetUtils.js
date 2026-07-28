import { getLocalDateString } from './dateUtils';

/**
 * Calculates running balance and summary totals for budget records.
 * Formula: Running Balance = Starting Amount + Income + Fund - Investment - Expense
 */
export const processBudgetRecords = (records = []) => {
  if (!Array.isArray(records) || records.length === 0) {
    return {
      processedList: [],
      currentBalance: 0,
      totalIncome: 0,
      totalExpense: 0,
      totalInvestment: 0,
      totalFund: 0,
      todayIncome: 0,
      todayExpense: 0,
      todayInvestment: 0,
      todayFund: 0,
      todayTransactions: 0,
    };
  }

  // 1. Sort records chronologically (oldest first) to compute running balance correctly
  const sortedAsc = [...records].sort((a, b) => {
    const timeA = new Date(a.date || a.createdTime).getTime();
    const timeB = new Date(b.date || b.createdTime).getTime();
    if (timeA !== timeB) return timeA - timeB;
    return (a.id || '').localeCompare(b.id || '');
  });

  let runningBalance = 0;
  let totalIncome = 0;
  let totalExpense = 0;
  let totalInvestment = 0;
  let totalFund = 0;

  const todayStr = getLocalDateString();
  let todayIncome = 0;
  let todayExpense = 0;
  let todayInvestment = 0;
  let todayFund = 0;
  let todayTransactions = 0;

  // 2. Iterate and compute running balance for each entry
  const updatedAsc = sortedAsc.map((item) => {
    const amount = parseFloat(item.amount) || 0;
    const type = (item.type || '').trim();
    const isToday = item.date === todayStr;

    if (type === 'Starting Amount' || type === 'Income' || type === 'Fund') {
      runningBalance += amount;
      if (type === 'Income') {
        totalIncome += amount;
        if (isToday) todayIncome += amount;
      }
      if (type === 'Fund') {
        totalFund += amount;
        if (isToday) todayFund += amount;
      }
    } else if (type === 'Investment' || type === 'Expense') {
      runningBalance -= amount;
      if (type === 'Expense') {
        totalExpense += amount;
        if (isToday) todayExpense += amount;
      }
      if (type === 'Investment') {
        totalInvestment += amount;
        if (isToday) todayInvestment += amount;
      }
    }

    if (isToday) {
      todayTransactions++;
    }

    return {
      ...item,
      amount,
      balance: runningBalance,
    };
  });

  // 3. Return newest first (descending) for table displays, along with exact totals
  const processedList = [...updatedAsc].reverse();

  return {
    processedList,
    currentBalance: runningBalance,
    totalIncome,
    totalExpense,
    totalInvestment,
    totalFund,
    todayIncome,
    todayExpense,
    todayInvestment,
    todayFund,
    todayTransactions,
  };
};
