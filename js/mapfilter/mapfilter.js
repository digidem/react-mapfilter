'use strict'

var _ = require('lodash')
window.u = require('./template_utils.js') // TODO, move these functions w/in tpl scope

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
    config.load(token)

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
      collection.options = loaded.options

      // load specified templates from github
      for (var t in loaded.templates) {
        config.getTemplate(loaded.templates[t].file)
      }

      // load collection data
      collection.fetch({
        silent: true,
        success: function (collection, resp, options) {
          collection.trigger('firstfetch', collection, resp, options)
        }
      })
    })

    // save template body to views
    config.listenTo(config, 'template', function (filename, body) {
      _.findWhere(config.options.templates, {'file': filename})

      // match pane from filename
      var paneName = filename.split('/')[1].slice(0, -4)
      console.log(appView)
      console.log(paneName)
      _.findWhere(appView, {'id': paneName}).template = _.template(body)
      if (paneName === 'info-pane') {
        appView.collection.template = _.template(body)
      }
    })
  })

  var appView = new AppView({
    el: options.el,
    auth: auth,
    config: config,

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
