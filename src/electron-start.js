// Required to run
const { electron, ipcMain, app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

// File system
const fs = require('fs');

// init window
let mainWindow

function createWindow() {
    // Create browser window
  mainWindow = new BrowserWindow({width:1600, height:1200, minWidth: 850, minHeight: 650, icon:__dirname+'/images/mediaIcon.png', webPreferences: {nodeIntegration: true}});


  // Load index.html
  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
      })
  )

  // Open devtools
  mainWindow.webContents.openDevTools();

  // When the window is closed set it to null
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Run create window function
app.on('ready', createWindow)

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/* -------------------------------------------------------------------------------------------------------------------------------------------
  Start of IPCs
------------------------------------------------------------------------------------------------------------------------------------------- */

// Create file taking file name and content
ipcMain.on('create-file', function (event, params) {
  fs.writeFile(__dirname + '/test_files/' + params.filename, params.content, (err) => {
    if (err) {
      console.log("Error ocurred creating file " + err.message);
      event.returnValue = false;
    }
    console.log("File created");
    event.returnValue = true;
  })
})