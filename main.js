const { app, BrowserWindow } = require('electron');
const path = require('path');
const ModelScraper = require('./scraper');

let scraper;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();

  // Initialize scraper
  scraper = new ModelScraper();
  console.log('🕷️ Model scraper initialized');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (scraper) {
    scraper.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});