const {app, BrowserWindow, webFrame, screen, ipcMain} = require('electron')
function createWindow () {
  
  // loadURL(require('url').format({
  //   pathname: __dirname+'/a.html',
  //   protocol: 'file:',
  //   slashes: true
  // }))//'../index.html')//loadFile('a.html')
}
app.whenReady().then(() => createWindow())
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


app.on('ready', function() {
  const mainWindow = new BrowserWindow({show : false, webPreferences: { nodeIntegration: true }})
  mainWindow.maximize();
  mainWindow.show();
  // mainWindow.setMenu(null)
  let dirname = __dirname.split('/')
  dirname.pop()
  dirname = 'file://'+ dirname.join('/') + '/index.html'
  mainWindow.loadURL(dirname)
})

ipcMain.on('getScreenSize', e => e.sender.send('gotScreenSize', screen.getPrimaryDisplay().workAreaSize))
