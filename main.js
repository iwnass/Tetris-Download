// main.js
const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater'); 

const path = require('path');
const RPC = require('discord-rpc');

// Discord RPC setup
const CLIENT_ID = '1380171821755928617';
let rpc = null;
let startTime = Date.now();

function initDiscordRPC(gameName = 'Tetris By Iwnas') {
  rpc = new RPC.Client({ transport: 'ipc' });
  
  rpc.on('ready', () => {
    console.log('Discord RPC connected');
    setActivity(gameName);
  });
  
  rpc.login({ clientId: CLIENT_ID }).catch(err => {
    console.error('Failed to connect to Discord:', err);
  });
}

function setActivity(gameName) {
  if (!rpc) return;

  rpc.setActivity({
  details: 'Playing Tetris',
  startTimestamp: Date.now(),
  largeImageKey: 'game_logo',
  largeImageText: 'Tetris by Iwnas',
  instance: false,
  buttons: [
    {
      label: 'Download / Play',
      url: 'https://example.com/download' // Must be HTTPS!
    }
  ]
});

}


function destroyRPC() {
  if (rpc) {
    rpc.destroy();
    rpc = null;
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    resizable: true,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
    contextIsolation: true
    }
  });

  win.loadFile('index.html');

  //auto-update 
  autoUpdater.checkForUpdatesAndNotify();
}

app.whenReady().then(() => {
  createWindow();
  initDiscordRPC('Tetris'); // Start Discord RPC

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  destroyRPC(); // Clean up Discord RPC
});