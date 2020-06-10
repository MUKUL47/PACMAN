// Modules to control application life and create native browser window
const {app, BrowserWindow, webFrame} = require('electron')
function createWindow () {
  const mainWindow = new BrowserWindow({show : false})
  mainWindow.maximize();
  mainWindow.show();
  mainWindow.setMenu(null)
  mainWindow.loadFile('../../index.html')
}
app.whenReady().then(() => createWindow())
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
