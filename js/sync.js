var path = require('path')
var level = require('level')
var hyperlog = require('hyperlog')
var mkdirp = require('mkdirp')

var odksync = require('odk-sync')

var configdir = path.join(require('xdg-basedir').config, 'mapfilter')
var blobdir = path.join(configdir, 'blob')
mkdirp.sync(blobdir)

module.exports = odksync({
  db: level(path.join(configdir, 'sync.db')),
  log: hyperlog(level(path.join(configdir, 'log.db')),
    { valueEncoding: 'json' }),
  metalog: hyperlog(level(path.join(configdir, 'metalog.db')),
    { valueEncoding: 'json' }),
  dir: blobdir
})
