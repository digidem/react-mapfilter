'use strict'

var Auth = require('./auth.js')
var Collection = require('./collection.js')
var MonitoringPoint = require('./monitoring_point.js')
var AppView = require('./appview.js')

module.exports = function (options) {
  var config = options.config
  var collection = new Collection(void 0, {
    model: MonitoringPoint,
    comparator: 'start'
  })

  var auth = new Auth(config.options.auth, function (token) {
    config.load()

    config.listenTo(config, 'load', function (loaded) {
      // simpleodk config loaded from github

      // reconstruct full url for datafile from repo local path
      // so collection backbone-sync can parse it
      var dataUrl = [
        'https://github.com',
        config.github.owner,
        config.github.repo,
        config.github.mode,
        config.github.branch,
        loaded.data
      ].join('/')
      collection.resetToken(token, dataUrl)

      // load collection data
      collection.fetch({
        silent: true,
        success: function (collection, resp, options) {
          collection.trigger('firstfetch', collection, resp, options)
        }
      })

      // compile info template
      collection.template = loaded.info && loaded.info.template
    })
  })

  var appView = new AppView({
    el: options.el,
    auth: auth,

    // data filter and display
    collection: collection,
    filters: config.options.filters,

    // map config
    mapCenter: config.options.map.center,
    mapZoom: config.options.map.zoom,
    tileUrl: config.options.tileUrl,
    bingKey: config.options.bingKey
  })

  return appView
}
