var Backbone = require('backbone')
var xhr = require('xhr')
var _ = require('lodash')

// Config Loader View, parses repo id from hash string
// loads file from github
// triggers 'load' event when ready

module.exports = Backbone.View.extend({
  // parse window.location.hash for named params
  parse: function (hash, options) {
    this.options = options || {}

    var params = hash.substr(1).split('&')
    for (var i in params) {
      var pair = params[i].split('=')
      var key = pair[0]
      var val = pair[1]

      if (key === 'map') {
        this.options.map = this.parseMapCenter(val)
      }
      if (key === 'id') {
        var parts = val.split(':')
        this.github = this.parseGithubId(parts[1])
      }
    }

    return this
  },

  // parse map center as zoom/latitude/longitude
  parseMapCenter: function (str) {
    var parts = str.split('/')
    return {
      zoom: parts[0],
      center: [parseFloat(parts[1]), parseFloat(parts[2])]
    }
  },

  // follows github:owner/repo/blob/master/file api from geojson.io
  // with sensible defaults
  parseGithubId: function (id) {
    var parts = id.split('/')
    return {
      owner: parts[0],
      repo: parts[1],
      mode: parts[2] || 'tree',
      branch: parts[3] || 'master',
      file: parts.slice(4).join('/') || 'simpleodk.json'
    }
  },

  // load config from github
  load: function (token) {
    var self = this
    var configUrl = 'http://localhost:3210/odk.json'
    xhr(configUrl, function (err, res, body) {
      var data = JSON.parse(body)
      self.options = _.defaults(data, self.options)
      self.trigger('load', self.options)
    })
  },

  // download template file from github
  getTemplate: function (file) {
    var self = this
    if (this.githubFs) {
      this.githubFs.readFile(file, {encoding: 'ascii'}, function (err, response) {
        if (err) throw err
        self.trigger('template', file, response)
      })
    }
  }
})
