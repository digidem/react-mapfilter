// MonitoringPoint
// ---------------

// MonitoringPoint extends `Backbone.Model` with accessor methods
// which format the model attributes for use in the view templates.
// If the fields on the model should change, you can just change these
// methods without needing to modify the rest of the application.
'use strict'

var _ = require('lodash')

module.exports = require('backbone').Model.extend({
  idAttribute: '_uuid',

  get: function (key) {
    return this.attributes.properties[key]
  },

  // returns keys of geojson properties, excluding meta and picture
  properties: function () {
    return _.keys(_.omit(this.attributes.properties, ['meta', 'picture']))
  },

  // Should return a [lat, lon] array for the point
  coordinates: function () {
    if (!this.attributes.geometry) return

    var lat = this.attributes.geometry.coordinates[1]
    var lon = this.attributes.geometry.coordinates[0]

    return [lat, lon]
  },

  getFormatedCoords: function (digits) {
    digits = digits || 5

    var lat = this.coordinates()[0].toFixed(digits)
    var lon = this.coordinates()[1].toFixed(digits)

    lat += (lat > 0) ? '&deg; N' : '&deg; S'
    lon += (lon > 0) ? '&deg; E' : '&deg; W'

    return lat + ' ' + lon
  },

  getImage: function () {
    var picture = this.get('picture')
    return picture && picture.url
  }
})
