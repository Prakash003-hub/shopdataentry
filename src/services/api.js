import axios from 'axios';
import { getLocalDateString } from '../utils/dateUtils';

// Default deployed Google Apps Script REST API Web App URL
export const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbwVEmDGCPfnGkW1QCCyv6n0MerKTShIz4MwWnj7p9M7a4a3JN9j0RNY2pZJvAZeeMB9/exec';

export const getStoredGasUrl = () => {
  return localStorage.getItem('subi_gas_url') || DEFAULT_GAS_URL;
};

export const setStoredGasUrl = (url) => {
  if (url) {
    localStorage.setItem('subi_gas_url', url.trim());
  } else {
    localStorage.removeItem('subi_gas_url');
  }
};

// Generic Apps Script POST request helper (Strict 100% Online Direct)
const callGasApi = async (action, data = {}) => {
  if (!navigator.onLine) {
    throw new Error('INTERNET_REQUIRED: An active internet connection is required to communicate with Google Sheets.');
  }

  const gasUrl = getStoredGasUrl();
  if (!gasUrl) {
    throw new Error('GAS_URL_NOT_CONFIGURED: Google Apps Script Web App URL is missing.');
  }

  const payload = { action, ...data };
  
  const response = await axios.post(gasUrl, JSON.stringify(payload), {
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    timeout: 20000,
  });

  if (response.data && response.data.success !== undefined) {
    return response.data;
  }
  return response.data;
};

// ----------------- AUTHENTICATION -----------------
export const apiLogin = async (password) => {
  try {
    const res = await callGasApi('login', { password });
    if (res.success) {
      return res;
    }
  } catch (e) {
    console.warn('GAS API login failed, checking fallback credentials:', e);
  }
  
  // Strict password validation (132003)
  if (password === '132003') {
    return { success: true, token: 'subi_session_' + Date.now() };
  } else {
    return { success: false, message: 'Invalid password' };
  }
};

// ----------------- BUDGET APIS (ONLINE DIRECT) -----------------
export const apiAddBudget = async (record) => {
  const id = record.id || `BGD_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const dateVal = record.date || getLocalDateString();
  const payload = {
    ...record,
    id,
    date: dateVal,
    amount: parseFloat(record.amount) || 0,
  };

  try {
    const res = await callGasApi('budget_add', payload);
    return res;
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to save transaction to Google Sheets.',
    };
  }
};

export const apiGetBudgetList = async () => {
  try {
    const res = await callGasApi('budget_list');
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch budget list from Google Sheets:', error);
    return [];
  }
};

export const apiUpdateBudget = async (record) => {
  try {
    return await callGasApi('budget_update', record);
  } catch (error) {
    return { success: false, message: 'Failed to update record on Google Sheets.' };
  }
};

export const apiDeleteBudget = async (id) => {
  try {
    return await callGasApi('budget_delete', { id });
  } catch (error) {
    return { success: false, message: 'Failed to delete record from Google Sheets.' };
  }
};

// ----------------- CUSTOMER FEEDBACK APIS (ONLINE DIRECT) -----------------
export const apiAddFeedback = async (record) => {
  const id = record.id || `FB_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const payload = {
    ...record,
    id,
    status: record.status || 'Pending',
    date: record.date || getLocalDateString(),
  };

  try {
    return await callGasApi('feedback_add', payload);
  } catch (error) {
    return { success: false, message: 'Failed to save feedback to Google Sheets.' };
  }
};

export const apiGetFeedbackList = async () => {
  try {
    const res = await callGasApi('feedback_list');
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch feedback list from Google Sheets:', error);
    return [];
  }
};

export const apiUpdateFeedback = async (record) => {
  try {
    return await callGasApi('feedback_update', record);
  } catch (error) {
    return { success: false, message: 'Failed to update feedback on Google Sheets.' };
  }
};

export const apiDeleteFeedback = async (id) => {
  try {
    return await callGasApi('feedback_delete', { id });
  } catch (error) {
    return { success: false, message: 'Failed to delete feedback from Google Sheets.' };
  }
};

// ----------------- CUSTOMER DATA APIS (ONLINE DIRECT) -----------------
export const apiAddCustomer = async (record) => {
  const id = record.id || `CST_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const payload = {
    ...record,
    id,
  };

  try {
    return await callGasApi('customer_add', payload);
  } catch (error) {
    return { success: false, message: 'Failed to save customer data to Google Sheets.' };
  }
};

export const apiGetCustomerList = async () => {
  try {
    const res = await callGasApi('customer_list');
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch customer list from Google Sheets:', error);
    return [];
  }
};

export const apiUpdateCustomer = async (record) => {
  try {
    return await callGasApi('customer_update', record);
  } catch (error) {
    return { success: false, message: 'Failed to update customer data on Google Sheets.' };
  }
};

export const apiDeleteCustomer = async (id) => {
  try {
    return await callGasApi('customer_delete', { id });
  } catch (error) {
    return { success: false, message: 'Failed to delete customer data from Google Sheets.' };
  }
};

// ----------------- GOOGLE DRIVE FILE UPLOAD (ONLINE DIRECT) -----------------
export const apiUploadFiles = async (files) => {
  try {
    const res = await callGasApi('upload', { files });
    if (res.success && res.files) {
      return res.files;
    }
    return [];
  } catch (error) {
    console.error('Drive upload failed:', error);
    throw new Error('Google Drive file upload failed. Internet connection required.');
  }
};

export const getOfflineQueue = async () => [];
export const syncOfflineQueue = async () => ({ synced: 0 });
