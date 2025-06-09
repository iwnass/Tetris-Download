// main.js
const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater'); 
const path = require('path');
const RPC = require('discord-rpc');

// Discord RPC setup
const CLIENT_ID = '1380171821755928617';
let rpc = null;
let startTime = Date.now();

// Configure auto-updater
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'iwnass',
  repo: 'Tetris-Download'
});

// Auto-updater events
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info.version);
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: `A new version (${info.version}) is available!`,
    detail: 'The update will be downloaded in the background. You will be notified when it is ready to install.',
    buttons: ['OK']
  });
});

autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available:', info.version);
});

autoUpdater.on('error', (err) => {
  console.error('Auto-updater error:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.log(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded:', info.version);
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Ready',
    message: `Update ${info.version} has been downloaded and is ready to install.`,
    detail: 'The application will restart to apply the update.',
    buttons: ['Restart Now', 'Later']
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

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
}

app.whenReady().then(() => {
  createWindow();
  initDiscordRPC('Tetris'); // Start Discord RPC
  
  // Check for updates after app is ready
  setTimeout(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, 3000); // Wait 3 seconds before checking

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