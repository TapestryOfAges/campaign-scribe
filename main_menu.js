function menu_module() {
  const {Menu} = require('electron')
  const electron = require('electron')
  const app = electron.app

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
              if (loaded) { save_campaign(); } 
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
}

main_menu.exports(menu_module);

function load_campaign() {
  controlWindow.webContents.send('load');
}
function save_campaign() {
  controlWindow.webContents.send('save');
}