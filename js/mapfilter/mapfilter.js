'use strict'

var Collection = require('./collection.js')
var MonitoringPoint = require('./monitoring_point.js')
var AppView = require('./appview.js')

module.exports = function (options) {
  var appView = new AppView({
    el: options.el,

    auth: options.config.auth,

    collection: new Collection(void 0, {
      model: MonitoringPoint,
      template: options.infoTemplate,
      url: options.config.repository.url,
      comparator: 'start'
    }),

    filters: options.filters,

    // Initial map center point (TODO: set this & zoom based on data bounds)
    mapCenter: [2.6362, -59.4801],

    // Initial map zoom
    mapZoom: 10,

    // pull config options
    infoTemplate: options.config.repository.info.file,
    tileUrl: options.config.tileUrl,
    bingKey: options.config.bingKey
  })

  return appView
}
