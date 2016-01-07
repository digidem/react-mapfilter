'use strict'

// globally self-installing deps
require('./lib/locale.js')
require('./lib/leaflet-0.7.1.js')
require('./lib/bing_layer.js')
require('./lib/leaflet_providers.js')
require('./lib/d3.v3.js')

var $ = require('jquery')

// app
window.locale.en = require('../data/en')
var mapFilter = require('./mapfilter/mapfilter.js')
var config = require('../config.json')
var auth = require('./mapfilter/auth.js')

var hostname = window.location.hostname

config = config[hostname] || config['lab.digital-democracy.org']

window.app = mapFilter({
  // target for github database
  url: config.dataUrl,

  // app container
  el: $('#app'),

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
  }],

  githubToken: auth(config),

  // Template to generate maptile urls. See http://leafletjs.com/reference.html#url-template
  tileUrl: 'http://{s}.tiles.mapbox.com/v3/gmaclennan.wapichana_background/{z}/{x}/{y}.jpg',
  // tileUrl: 'http://localhost:20008/tile/wapichana_background/{z}/{x}/{y}.png',

  // API key for Bing Maps use
  bingKey: 'AtCQswcYKiBKRMM8MHjAzncJvN6miHjgxbi2-m1oaFUHMa06gszNwt4Xe_te18FF'
})
