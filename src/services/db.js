import { openDB } from 'idb';

const DB_NAME = 'subi_online_service_db';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Budget records
      if (!db.objectStoreNames.contains('budget')) {
        const budgetStore = db.createObjectStore('budget', { keyPath: 'id' });
        budgetStore.createIndex('date', 'date');
      }
      // Customer feedback records
      if (!db.objectStoreNames.contains('feedback')) {
        const feedbackStore = db.createObjectStore('feedback', { keyPath: 'id' });
        feedbackStore.createIndex('date', 'date');
      }
      // Customer data records
      if (!db.objectStoreNames.contains('customer')) {
        const customerStore = db.createObjectStore('customer', { keyPath: 'id' });
        customerStore.createIndex('phone', 'phone');
      }
      // Offline queue for actions taken when internet is disconnected
      if (!db.objectStoreNames.contains('unsynced_queue')) {
        db.createObjectStore('unsynced_queue', { keyPath: 'queueId', autoIncrement: true });
      }
    },
  });
};

// Data Helpers
export const getAllRecords = async (storeName) => {
  const db = await initDB();
  return db.getAll(storeName);
};

export const saveRecord = async (storeName, record) => {
  const db = await initDB();
  return db.put(storeName, record);
};

export const deleteRecord = async (storeName, id) => {
  const db = await initDB();
  return db.delete(storeName, id);
};

export const clearStore = async (storeName) => {
  const db = await initDB();
  return db.clear(storeName);
};

// Queue Helpers for Offline Sync
export const enqueueOfflineAction = async (actionType, payload) => {
  const db = await initDB();
  const queueItem = {
    actionType, // e.g. 'budget_add', 'feedback_add', 'customer_add'
    payload,
    timestamp: new Date().toISOString(),
  };
  return db.add('unsynced_queue', queueItem);
};

export const getOfflineQueue = async () => {
  const db = await initDB();
  return db.getAll('unsynced_queue');
};

export const clearOfflineQueue = async () => {
  const db = await initDB();
  return db.clear('unsynced_queue');
};
