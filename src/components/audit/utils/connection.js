export const isAppOnline = () => {
  if (typeof localStorage !== 'undefined') {
    if (localStorage.getItem('audit_simulated_offline') === 'true') {
      return false;
    }
  }
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

export const toggleOfflineSimulation = (simulate) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('audit_simulated_offline', simulate ? 'true' : 'false');
    if (!simulate) {
      // Dispatch a standard 'online' event so that the SyncManager 
      // automatically picks it up and processes the sync queue
      window.dispatchEvent(new Event('online'));
    } else {
      // Dispatch an 'offline' event for any components listing to offline changes
      window.dispatchEvent(new Event('offline'));
    }
  }
};
