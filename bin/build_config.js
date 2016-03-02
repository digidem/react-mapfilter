#!/usr/bin/env node

var mkdirp = require('mkdirp')
var fs = require('fs')
var path = require('path')

var configs = require('../config.json')
var distFolder = path.join(__dirname, '../dist')

configs.forEach(function (c) {
  mkdirp.sync(path.join(distFolder, c.alias))
  var configHash = '#id=' + c.id
  var html = '<!DOCTYPE html><html>' +
    '<title>Mapfilter Config Redirect</title>' +
    '<script>' +
      'var newUrl = window.location.href.replace(/' + c.alias + '\\/?/, "") + "' + configHash + '";' +
      'window.location.replace(newUrl);' +
    '</script>'
  fs.writeFileSync(path.join(distFolder, c.alias, 'index.html'), html)
})
