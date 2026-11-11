const { app, BrowserWindow, BrowserView, ipcMain, session, shell } = require('electron');
const path = require('path');

const SLOTS = [
  { id: 'muse3', label: 'Muse 3', url: process.env.MUSE3_URL || 'https://muse.ai' },
  { id: 'muse2', label: 'Muse 2', url: process.env.MUSE2_URL || 'https://muse.ai' },
  { id: 'muse1', label: 'Muse 1', url: process.env.MUSE1_URL || 'https://muse.ai' },
];
let mainWindow;
let views = [];
let currentIndex = 0;

function iconForPlatform() {
  if (process.platform === 'win32') return path.join(__dirname, 'assets', 'icon.ico');
  if (process.platform === 'darwin') return path.join(__dirname, 'assets', 'icon.icns');
  return path.join(__dirname, 'assets', 'icon.png');
}

function layoutViews() {
  if (!mainWindow) return;
  const [width, height] = mainWindow.getContentSize();
  const barHeight = 40;
  for (let i = 0; i < views.length; i++) {
    views[i].setBounds({ x: 0, y: 0, width, height: Math.max(1, height - barHeight) });
    views[i].setVisible(i === currentIndex);
  }
}

function selectSlot(index) {
  if (!Number.isInteger(index) || index < 0 || index >= views.length) return;
  currentIndex = index;
  layoutViews();
  mainWindow.webContents.send('slot-selected', { index, ...SLOTS[index] });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280, height: 900, minWidth: 800, minHeight: 560,
    backgroundColor: '#FAF6F0',
    icon: iconForPlatform(),
    title: 'Desktop Buddy',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false },
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  mainWindow.on('resize', layoutViews);
  mainWindow.on('closed', () => { mainWindow = null; views = []; });

  views = SLOTS.map((slot) => {
    const view = new BrowserView({ webPreferences: { partition: `persist:${slot.id}`, contextIsolation: true, sandbox: true } });
    mainWindow.addBrowserView(view);
    view.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
    view.webContents.on('did-finish-load', () => mainWindow?.webContents.send('slot-load-state', { id: slot.id, loading: false }));
    view.webContents.on('did-start-loading', () => mainWindow?.webContents.send('slot-load-state', { id: slot.id, loading: true }));
    view.webContents.loadURL(slot.url);
    return view;
  });
  selectSlot(0);
}

ipcMain.handle('select-slot', (_event, index) => { selectSlot(index); return SLOTS[index] || null; });
ipcMain.handle('navigate-slot', (_event, direction) => {
  const view = views[currentIndex];
  if (!view) return false;
  if (direction === 'back' && view.webContents.canGoBack()) { view.webContents.goBack(); return true; }
  if (direction === 'forward' && view.webContents.canGoForward()) { view.webContents.goForward(); return true; }
  return false;
});
ipcMain.handle('reload-slot', () => { views[currentIndex]?.webContents.reload(); return true; });
ipcMain.handle('get-state', () => ({ currentIndex, slots: SLOTS }));

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
