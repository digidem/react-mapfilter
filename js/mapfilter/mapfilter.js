'use strict'

var Auth = require('./auth.js')
var Collection = require('./collection.js')
var MonitoringPoint = require('./monitoring_point.js')
var AppView = require('./appview.js')

module.exports = function (options) {
  var config, collection

  var auth = new Auth(options.config.options.auth, function (token) {
    config = options.config.load()

    collection = new Collection(void 0, {
      model: MonitoringPoint,
      template: config.info && config.info.template,
      url: config.data,
      comparator: 'start'
    })
    collection.setToken(token)
  })

  var appView = new AppView({
    el: options.el,

    auth: auth,

    // data filter and display
    collection: collection,
    filters: config.filters,
    infoTemplate: config.info && config.info.template,

    // map config
    mapCenter: config.map.center,
    mapZoom: config.map.zoom,
    tileUrl: config.tileUrl,
    bingKey: config.bingKey
  })

  return appView
}
