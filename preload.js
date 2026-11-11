const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('desktopBuddy', {
  selectSlot: (index) => ipcRenderer.invoke('select-slot', index),
  navigateSlot: (direction) => ipcRenderer.invoke('navigate-slot', direction),
  reloadSlot: () => ipcRenderer.invoke('reload-slot'),
  getState: () => ipcRenderer.invoke('get-state'),
  onSlotSelected: (callback) => ipcRenderer.on('slot-selected', (_event, value) => callback(value)),
  onSlotLoadState: (callback) => ipcRenderer.on('slot-load-state', (_event, value) => callback(value)),
});
