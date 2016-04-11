var path = require('path')
var onend = require('end-of-stream')
var level = require('level')
var hyperlog = require('hyperlog')
var mkdirp = require('mkdirp')
var onend = require('end-of-stream')
var once = require('once')
var app = require('electron').remote.app
var odksync = require('odk-sync')

var configdir = path.join(app.getPath('userData'), 'monitoring_data')
var sync = fromdir(configdir)
exports.sync = sync

exports.replicate = function (dir, cb) {
  cb = once(cb || noop)
  var ex = fromdir(dir)
  var pending = 2
  var s = sync.replicate(onend)
  var r = ex.replicate(onend)
  s.pipe(r).pipe(s)

  setTimeout(function () {
    // replication often doesn't call its callback
    cb(null)
  }, 5000)
  function onend (err) {
    if (err) cb(err)
    else if (--pending === 0) cb()
  }
}

function fromdir (dir) {
  var blobdir = path.join(dir, 'blob')
  mkdirp.sync(blobdir)
  return odksync({
    db: level(path.join(dir, 'sync.db')),
    log: hyperlog(level(path.join(dir, 'log.db')),
      { valueEncoding: 'json' }),
    metalog: hyperlog(level(path.join(dir, 'metalog.db')),
      { valueEncoding: 'json' }),
    dir: blobdir
  })
}

function noop () {}
