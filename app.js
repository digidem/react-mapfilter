#!/usr/bin/env electron

var path = require('path')
var minimist = require('minimist')
var electron = require('electron')
var app = electron.app  // Module to control application life.
var Menu = electron.Menu
var BrowserWindow = electron.BrowserWindow  // Module to create native browser window.

var APP_NAME = app.getName()

// Path to `userData`, operating system specific, see
// https://github.com/atom/electron/blob/master/docs/api/app.md#appgetpathname
var userDataPath = app.getPath('userData')

// var tileServer = require('./tile-server.js')()
// tileServer.listen(argv.tileport, '127.0.0.1', function () {
//   console.log('tile server listening on :', server.address().port)
// })

var http = require('http')
var fs = require('fs')
var files = {
  odk: '/home/substack/projects/test-data/simpleodk.json',
  geo: '/home/substack/projects/test-data/submissions/incidente.geojson'
}

var server = http.createServer(function (req, res) {
  console.log(req.method, req.url)
  if (req.url === '/odk.json') {
    res.setHeader('content-type', 'text/json')
    fs.createReadStream(files.odk).pipe(res)
  } else if (req.url === '/data.geojson') {
    res.setHeader('content-type', 'text/json')
    fs.createReadStream(files.geo).pipe(res)
  } else {
    res.statusCode = 404
    res.end('not found\n')
  }
})
server.listen(3210)

app.on('ready', ready)
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  app.quit()
})

var win = null
// var menu = null

function ready () {
  var INDEX = 'file://' + path.resolve(__dirname, './index.html')
  win = new BrowserWindow({title: APP_NAME})
  win.maximize()
  win.loadURL(INDEX)

  // require('./lib/user-config')

  // menu = Menu.buildFromTemplate(menuTemplate(app))
  // Menu.setApplicationMenu(menu)

  // Emitted when the window is closed.
  win.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
    app.quit()
  })
}
