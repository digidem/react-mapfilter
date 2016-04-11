/**
 * Backbone sync adapter to use git as storage
 * Version 0.0.0
 *
 * https://github.com/digidem/Backbone.js-git
 * (c) 2014 Gregor MacLennan / Digital Democracy
 *
 * Backbone.js-git may be freely distributed under the MIT license
 */

// Require Underscore, if we're on the server, and it's not already present.
var _ = require('lodash')
var sync = require('../sync.js').sync

var Octokat = require('octokat')

var githubOwnerRe = /https:\/\/github\.com\/(.+?)\//
var githubRepoRe = /https:\/\/github\.com\/.+?\/(.+?)\//
var githubRefRe = /https:\/\/github\.com\/.+?\/.+?\/tree\/(.+?)\//
var githubPathRe = /https:\/\/github\.com\/.+?\/.+?\/tree\/.+?\/(.*?)\/?$/

// backbone-github sync adapter
module.exports = function (defaults) {
  defaults = defaults || {}

  return function adapter (method, model, options) {
    options = options || {}
    options = _.extend({}, defaults, model && model.github || {}, options)

    var owner = _.result(model, 'url').match(githubOwnerRe)
    var repo = _.result(model, 'url').match(githubRepoRe)
    owner = (owner && owner[1]) || options.user
    repo = (repo && repo[1]) || options.repo

    if (options.githubToken) {
      var auth = {
        token: options.githubToken,
        auth: 'oauth'
      }
    }

    var octo = new Octokat(auth)

    function work () {
      syncWorker({
        method: method,
        model: model,
        repo: octo.repos(owner, repo),
        options: options
      }, function (err, data) {
        if (err) return options.error(err)
        return options.success(data)
      })
    }
    work()
    var config = options.config
    config.listenTo(config, 'imported', function (docs) {
      if (docs.length > 0) work()
    })
  }
}

function syncWorker (data, callback) {
  var model = data.model
  var repo = data.repo

  var collection = model.collection || model

  var branch = _.result(collection, 'url').match(githubRefRe)
  branch = (branch && branch[1]) || data.options.branch || 'master'

  // *TODO* no handling of tags yet
  var ref = 'heads/' + branch

  if (data.method === 'read') {
    if (!model.collection) {
      findAll()
    } else {
      find()
    }
    if (model.trigger) model.trigger('request', model, null, data.options)
  } else {
    callback('Only "read" supported at this stage')
  }

  function find () {
    var collectionId = _.result(collection, 'url').match(githubPathRe)[1]
    var filename = model.id + '.json'
    getTree(collectionId, function (err, tree) {
      if (err) return callback(err)
      if (!tree[filename]) return callback('model not found')
      repo.loadAs('text', tree[filename].hash, function (err, json) {
        callback(err, JSON.parse(json))
      })
    })
  }

  function findAll () {
    sync.geojson(function (err, src) {
      if (err) return callback(err)
      try { var data = JSON.parse(src) }
      catch (err) { return callback(err) }
      callback(null, data.features)
    })
  }

  function getTree (collectionId, callback) {
    repo.git.refs(ref).fetch(onRef)

    function onRef (err, ref) {
      if (err) return callback(err)
      repo.git.commits(ref.object.sha).fetch(function (err, commit) {
        if (err) return callback(err)
        repo.git.trees(commit.tree.sha).fetch(onTree)
      })
    }

    function onTree (err, tree) {
      if (err) return callback(err)
      if (!tree[collectionId]) callback('Collection not found')
      repo.loadAs('tree', tree[collectionId].hash, function (err, tree) {
        callback(err, tree)
      })
    }
  }
}
