// Required to run
const { electron, ipcMain, app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

// File system
const fs = require('fs');

// electron-db
const db = require('electron-db');

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

// Create images table in app data
db.createTable('files', (succ, msg) => {
  // succ - boolean, tells if the call is successful
  console.log('Create table ' + {success: succ, Message: msg});
})

// Add a file to a table
ipcMain.on('add-file', function (event, params) {
  db.insertTableContent('files', params.obj, (succ, msg) => {
    // succ - boolean, tells if the call is successful
    console.log('Add file ' + {success: succ, Message: msg, params: params});
    event.returnValue = {succ: succ};
  });
})

// Get all files from a table
ipcMain.on('get-all-files', function (event, params) {
  db.getAll('files', (succ, data) => {
    // succ - boolean, tells if the call is successful
    // data - array of objects that represents the rows.
    console.log('Get all files ' + {success: succ, params: params, data: data});
    event.returnValue = {succ: succ, data: data};
  });
})

// Get rows from a table
ipcMain.on('get-rows', function (event, params) {
  db.getRows('files', params.where, (succ, result) => {
    // succ - boolean, tells if the call is successful
    console.log('Get rows ' + {success: succ, params: params, data: result});
    event.returnValue = {succ: succ, data: result}
  });
})

// Update rows from a table based on params
ipcMain.on('update-rows', function (event, params) {
  db.updateRow('files', params.where, params.set, (succ, msg) => {
    // succ - boolean, tells if the call is successful
    console.log('Update rows' + {success: succ, Message: msg, params: params});
    event.returnValue = {succ: succ};
  });
})

// Search records based on params
ipcMain.on('search-records', function (event, params) {
  db.search('files', params.col, params.term, (succ, data) => {
    // succ - boolean, tells if the call is successful
    // data - array of objects that represents the rows.
    console.log('Search records' + {success: succ, params: params, data: data});
    event.returnValue = {succ: succ, data: data};
  });
})

// Delete records based on params
ipcMain.on('delete-rows', function (event, params) {
  db.deleteRow('files', params.where, (succ, msg) => {
    // succ - boolean, tells if the call is successful
    console.log('Delete rows ' + {success: succ, Message: msg});
    event.returnValue = {succ: succ};
  });
})
