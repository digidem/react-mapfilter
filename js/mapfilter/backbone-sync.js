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

module.exports = function (defaults) {
  defaults = defaults || {}

  return function adapter (method, model, options) {
    options = options || {}
    options = _.extend({}, defaults, model && model.github || {}, options)

    syncWorker({
      method: method,
      model: model,
      options: options
    }, function (err, data) {
      if (err) return options.error(err)
      return options.success(data)
    })
  }
}

function syncWorker (data, callback) {
  var model = data.model

  if (data.method === 'read') {
    if (!model.collection) {
      findAll()
    } else {
      callback('No support for single model loading')
    }
    if (model.trigger) model.trigger('request', model, null, data.options)
  } else {
    callback('Only "read" supported at this stage')
  }

  function findAll () {
    sync.geojson(function (err, src) {
      if (err) return callback(err)
      try {
        var data = JSON.parse(src)
      } catch (err) {
        return callback(err)
      }
      callback(null, data.features)
    })
  }
}
