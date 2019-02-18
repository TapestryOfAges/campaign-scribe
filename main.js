'use strict';

//let app = require('app');
//let BrowserWindow = require('browser-window');
const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const {Menu} = require('electron')

const {ipcMain} = require('electron')

let mainWindow = null;
let controlWindow = null;

app.on('ready', function() {

    controlWindow = new BrowserWindow({
        height: 600,
        width: 1000
    });

    controlWindow.loadURL('file://' + __dirname + '/app-control/index.html');

    controlWindow.on('close', function() {
        app.quit();
    });
    
    const menutemplate = [
      {
        label: 'File',
        submenu: [
          {
            label: 'New',
            accelerator: 'CmdOrCtrl+N',
            click (item, focusedWindow) {
              if (focusedWindow) { new_campaign(); }
            }
          },
          {
            label: 'Load',
            accelerator: 'CmdOrCtrl+L',
            click (item, focusedWindow) {
              if (focusedWindow) { load_campaign(); }
            }
          },
          {
            label: 'Save',
            accelerator: 'CmdOrCtrl+S',
            click (item, focusedWindow) {
              if (focusedWindow) { 
                save_campaign(); 
              }
            }
          },
          {
            type: 'separator'
          },
          {
            role: 'quit'
          }
        ]
      },
      {
        label: 'Developer',
        submenu: [
          {
            label: 'Toggle Developer Tools',
            accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
            click (item, focusedWindow) {
              if (focusedWindow) focusedWindow.webContents.toggleDevTools()
            }
          },
        ]
      },
    ];
  
    if (process.platform === 'darwin') {
      const name = app.getName()
      template.unshift({
        label: name,
        submenu: [
          {
            role: 'about'
          },
          {
            type: 'separator'
          },
          {
            role: 'services',
            submenu: []
          },
          {
            type: 'separator'
          },
          {
            role: 'hide'
          },
          {
            role: 'hideothers'
          },
          {
            role: 'unhide'
          },
          {
            type: 'separator'
          },
          {
            role: 'quit'
          }
        ]
      })
      // Edit menu.
      template[1].submenu.push(
        {
          type: 'separator'
        },
        {
          label: 'Speech',
          submenu: [
            {
              role: 'startspeaking'
            },
            {
              role: 'stopspeaking'
            }
          ]
        }
      )
      // Window menu.
      template[3].submenu = [
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        },
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: 'Zoom',
          role: 'zoom'
        },
        {
          type: 'separator'
        },
        {
          label: 'Bring All to Front',
          role: 'front'
        }
      ]
    }
  
    const menu = Menu.buildFromTemplate(menutemplate)
    Menu.setApplicationMenu(menu)  
    
});

ipcMain.on('close-window', function() {
  app.quit();
});

ipcMain.on('set_round', function(event, rnd) {
  mainWindow.webContents.send('set_round',rnd);
});

ipcMain.on('change_bg', function(event, changeto) {
  mainWindow.webContents.send('change_bg',changeto);
});

ipcMain.on('change_location', function(event, changeto) {
  mainWindow.webContents.send('change_location',changeto);
});

ipcMain.on('init_table', function(event, table) {
  mainWindow.webContents.send('init_table',table);
});

ipcMain.on('run_game', function() {
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1200
  });

  mainWindow.loadURL('file://' + __dirname + '/app-display/index.html');

  mainWindow.on('close', function() {
    // send notification back to control
  });

  const menutemplate2 = [
    {
      label: 'Window',
      submenu: [
        {
          label: 'Reset Size',
          click (item, focusedWindow) {
            if (focusedWindow) {
              mainWindow.webContents.send('reset_size');
            }
          }
        },
      ],

      label: 'Developer',
      submenu: [
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools()
          }
        },
      ]
    },
  ];
  
  if (process.platform === 'darwin') {
    const name = app.getName()
    template.unshift({
      label: name,
      submenu: [
        {
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          role: 'hide'
        },
        {
          role: 'hideothers'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    })
    // Edit menu.
    template[1].submenu.push(
      {
        type: 'separator'
      },
      {
        label: 'Speech',
        submenu: [
          {
            role: 'startspeaking'
          },
          {
            role: 'stopspeaking'
          }
        ]
      }
    )
    // Window menu.
    template[3].submenu = [
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Zoom',
        role: 'zoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        role: 'front'
      }
    ]
  }
  
  const menu2 = Menu.buildFromTemplate(menutemplate2)
  mainWindow.setMenu(menu2);

});

function new_campaign() {
  controlWindow.webContents.send('new');
}
function load_campaign() {
  controlWindow.webContents.send('load');
}
function save_campaign() {
  controlWindow.webContents.send('save');
}