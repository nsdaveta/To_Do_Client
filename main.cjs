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
