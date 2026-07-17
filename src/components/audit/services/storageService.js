const DB_NAME = 'AuditAppDB';
const DB_VERSION = 4;
const STORE_NAME = 'drafts';
const REPORTS_STORE = 'odoo_reports';
const SYNC_QUEUE_STORE = 'sync_queue';
const IMAGES_STORE = 'images';

// Utility to open the database
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      if (!db.objectStoreNames.contains(REPORTS_STORE)) {
        db.createObjectStore(REPORTS_STORE);
      }
      if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
        db.createObjectStore(SYNC_QUEUE_STORE);
      }
      if (!db.objectStoreNames.contains(IMAGES_STORE)) {
        db.createObjectStore(IMAGES_STORE);
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

export const storageService = {
  async saveDraft(key, data) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(data, key);

      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  },

  async getDraft(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  },

  async getAllDrafts() {
    const db = await openDB();
    
    const getKeys = new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.getAllKeys();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    const getValues = new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    const [keys, values] = await Promise.all([getKeys, getValues]);
    return keys.map((key, i) => ({
      key,
      data: values[i]
    }));
  },

  async deleteDraft(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  },

  async saveReport(key, data) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(REPORTS_STORE, 'readwrite');
      const store = transaction.objectStore(REPORTS_STORE);
      const request = store.put(data, key);

      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  },

  async getReport(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(REPORTS_STORE, 'readonly');
      const store = transaction.objectStore(REPORTS_STORE);
      const request = store.get(key);

      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  },

  async addSyncTask(task) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
      const store = transaction.objectStore(SYNC_QUEUE_STORE);
      // task must have an 'id' property. If it exists, put will overwrite it.
      const request = store.put(task, task.id);

      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  },

  async getSyncTasks() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SYNC_QUEUE_STORE, 'readonly');
      const store = transaction.objectStore(SYNC_QUEUE_STORE);
      const request = store.getAll();

      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  },

  async removeSyncTask(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
      const store = transaction.objectStore(SYNC_QUEUE_STORE);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  },

  async clearAllData() {
    const db = await openDB();
    return Promise.all([
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const req = tx.objectStore(STORE_NAME).clear();
        req.onsuccess = () => resolve();
        req.onerror = (e) => reject(e.target.error);
      }),
      new Promise((resolve, reject) => {
        const tx = db.transaction(REPORTS_STORE, 'readwrite');
        const req = tx.objectStore(REPORTS_STORE).clear();
        req.onsuccess = () => resolve();
        req.onerror = (e) => reject(e.target.error);
      }),
      new Promise((resolve, reject) => {
        const tx = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
        const req = tx.objectStore(SYNC_QUEUE_STORE).clear();
        req.onsuccess = () => resolve();
        req.onerror = (e) => reject(e.target.error);
      }),
      new Promise((resolve, reject) => {
        const tx = db.transaction(IMAGES_STORE, 'readwrite');
        const req = tx.objectStore(IMAGES_STORE).clear();
        req.onsuccess = () => resolve();
        req.onerror = (e) => reject(e.target.error);
      })
    ]);
  },

  async saveImage(key, base64Data) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(IMAGES_STORE, 'readwrite');
      const store = transaction.objectStore(IMAGES_STORE);
      const request = store.put(base64Data, key);

      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  },

  async getImage(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(IMAGES_STORE, 'readonly');
      const store = transaction.objectStore(IMAGES_STORE);
      const request = store.get(key);

      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }
};
