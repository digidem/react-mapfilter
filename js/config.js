var Hubfs = require('Hubfs.js')
var _ = require('lodash')

module.exports = {
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
        this.githubOptions = this.parseGithubId(parts[1])
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
  parseGithubId: function (id) {
    var parts = id.split('/')
    return {
      owner: parts[0],
      repo: parts[1],
      mode: parts[2],
      branch: parts[3],
      file: parts.slice(4).join('/')
    }
  },

  // load config from github
  load: function (token) {
    var self = this
    if (this.githubOptions) {
      if (token) this.githubOptions.auth = { token: token}
      var githubFs = Hubfs(this.githubOptions)
      githubFs.readFile('config.json', {encoding: 'ascii'}, function (err, response) {
        if (err) throw err
        var data = JSON.parse(response)
        this.options = _.defaults(self.options, data)

        // use await?
        // or signal for data ready?
      })
    }

    // TODO, this returns before hubFs is done
    return this.options
  }
}
