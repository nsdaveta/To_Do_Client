const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const mainWindow = new BrowserWindow({
    width: Math.min(1200, width),
    height: Math.min(800, height),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: false,
      // preload: path.join(__dirname, 'preload.js') // Uncomment if you create a preload.js
    },
    icon: path.join(__dirname, 'public/favicon.ico'),
    title: 'To-Do List Native'
  });

  // This ensures the HashRouter starts at the home page
  const indexPath = path.join(__dirname, 'dist/index.html').replace(/\\/g, '/');
  mainWindow.loadURL(`file://${indexPath}#/`).catch((err) => {
    console.error('Failed to load app:', err);
  });

  // Hide menu bar for a native app feel
  mainWindow.setMenuBarVisibility(false);

  // Disable right-click context menu
  mainWindow.webContents.on('context-menu', (e) => {
    e.preventDefault();
  });

  // Disable developer tools keyboard shortcuts
  mainWindow.webContents.on('before-input-event', (event, input) => {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J
    if (
      input.control &&
      input.shift &&
      (input.key.toLowerCase() === 'i' || input.key.toLowerCase() === 'j' || input.key.toLowerCase() === 'c')
    ) {
      event.preventDefault();
    }
    if (input.key === 'F12') {
      event.preventDefault();
    }
  });
}


app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
