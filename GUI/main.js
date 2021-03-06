const {app, BrowserWindow, webFrame, screen, ipcMain} = require('electron')

// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') app.quit()
// })

app.on('ready', function() {
  const mainWindow = new BrowserWindow({show : false, webPreferences: { nodeIntegration: true }})
  mainWindow.maximize();
  mainWindow.show();
  // mainWindow.setMenu(null)
  let dirname = __dirname.split('/')
  dirname.pop()
  dirname = 'file://'+ dirname.join('/') + '/index.html'
  mainWindow.loadURL('http://localhost:3300')
})

// ipcMain.on('getScreenSize', e => e.sender.send('gotScreenSize', screen.getPrimaryDisplay().workAreaSize))
