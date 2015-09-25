'use strict'

var Collection = require('./collection.js')
var MonitoringPoint = require('./monitoring_point.js')
var AppView = require('./appview.js')

module.exports = function (options) {
  var appView = new AppView({
    el: options.el,

    collection: new Collection(void 0, {
      model: MonitoringPoint,
      url: options.url,
      comparator: 'start',
      githubToken: options.githubToken
    }),

    filters: options.filters,

    // Initial map center point (TODO: set this & zoom based on data bounds)
    mapCenter: [51.64792, -1.45042],

    // Initial map zoom
    mapZoom: 17,

    tileUrl: options.tileUrl,

    bingKey: options.bingKey
  })

  return appView
}
