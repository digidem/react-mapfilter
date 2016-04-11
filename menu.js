var dialog = require('electron').dialog

module.exports = function (app) {
  var template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Import Filter Setup...',
          click: function (item, focusedWindow) {
            dialog.showOpenDialog({
              title: 'Select Filter Setup file',
              filters: [{name: 'JSON', extensions: ['json']}],
              properties: ['openFile']
            }, function (filenames) {
              if (!filenames) return
              filenames.forEach(function (file) {
                focusedWindow.webContents.send('select-import-filter', file)
              })
            })
          }
        },
        {
          label: 'Synchronize Data...',
          click: function (item, focusedWindow) {
            dialog.showOpenDialog({
              title: 'Select folder to sync',
              filters: [],
              properties: ['openDirectory']
            }, function (filenames) {
              if (!filenames) return
              filenames.forEach(function (file) {
                focusedWindow.webContents.send('select-sync-dir', file)
              })
            })
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo',
          visible: false
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo',
          visible: false
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.reload()
            }
          },
          visible: true
        },
        {
          label: 'Full Screen',
          accelerator: (function () {
            if (process.platform === 'darwin') {
              return 'Ctrl+Command+F'
            } else {
              return 'F11'
            }
          })(),
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
            }
          }
        },
        {
          label: 'Open Developer Tools',
          accelerator: (function () {
            if (process.platform === 'darwin') {
              return 'Alt+Command+I'
            } else {
              return 'Ctrl+Shift+I'
            }
          })(),
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.toggleDevTools()
            }
          },
          visible: true
        }
      ]
    },
    {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        }
      ]
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
      ]
    }
  ]

  if (process.platform === 'darwin') {
    var name = require('electron').app.getName()
    template.unshift({
      label: name,
      submenu: [
        {
          label: 'About ' + name,
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide ' + name,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide others',
          accelerator: 'Command+Alt+H',
          role: 'hideothers'
        },
        {
          label: 'Unhide',
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit ' + name,
          accelerator: 'Command+Q',
          click: function () { app.quit() }
        }
      ]
    })
    // Window menu.
    template[4].submenu.push(
      {
        type: 'separator'
      },
      {
        label: 'Bring all to front',
        role: 'front'
      }
    )
  }
  return template
}
