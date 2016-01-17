'use strict'

// globally self-installing deps
require('./lib/locale.js')
require('./lib/leaflet-0.7.1.js')
require('./lib/bing_layer.js')
require('./lib/leaflet_providers.js')
require('./lib/d3.v4.js')
require('./lib/d3-dates.v4.js')

var $ = require('jquery')

// app
window.locale.en = require('../locale/en')
window.locale.fr = require('../locale/fr')
window.locale.es = require('../locale/es')
window.locale.init()

var mapFilter = require('./mapfilter/mapfilter.js')

var config = require('./config.js')
var hash = window.location.hash
if (hash === '') {
  // default to sample data
  hash = '#id=github:spacedogxyz/sample-monitoring-data/blob/master/monitoring/monitoring.geojson' +
         '&map=10/2.6362/-59.4801'
}
var defaults = {
  auth: {
    domain: 'digidem.auth0.com',
    clientID: 'b1XsBJ1mK4HFzaFYsgjQW4IGyC60VUwb'
  },

  bingKey: 'AtCQswcYKiBKRMM8MHjAzncJvN6miHjgxbi2-m1oaFUHMa06gszNwt4Xe_te18FF',
  tileUrl: 'http://{s}.tiles.mapbox.com/v3/gmaclennan.wapichana_background/{z}/{x}/{y}.jpg',

  // An array of filters to explore the data.
  // `field` is the field/attribute to filter by
  // `type` should be `discrete` for string data and `continuous` for numbers or dates
  // `expanded` sets whether the filter view is expanded or collapsed by default
  filters: [{
    type: 'continuous',
    field: 'today',
    expanded: true
  }, {
    type: 'discrete',
    field: 'happening',
    expanded: true
  }, {
    type: 'discrete',
    field: 'people',
    expanded: true
  }]
}

window.app = mapFilter({
  config: config.parse(hash, defaults),

  // app container
  el: $('#app')
})
