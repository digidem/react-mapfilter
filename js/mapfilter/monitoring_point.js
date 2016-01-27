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

  get: function (attr) {
    return this.attributes.properties[attr] || 'not_recorded'
  },

  // returns keys of geojson properties. Omits _prefixed and meta fields
  properties: function () {
    return _.keys(_.omit(this.attributes.properties, function (value, key, object) {
        return key[0] === '_' ||
          _.contains(['meta'], key)
      })
    )
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
    var imageField = this.collection.template ? this.collection.template.image : 'picture'
    var picture = this.get(imageField)
    return picture && picture.url
  },

  getDate: function () {
    var dateField = this.collection.template ? this.collection.template.timestamp : 'today'
    var d = this.get(dateField).split('-')
    return new Date(d[0], d[1] - 1, d[2])
  },

  // Takes a field that is a space-separated list of values, which may include "other"
  // and formats that field together with the "other" field into a comma-separated
  // list of readable text.
  _getOther: function (attr, attr_other) {
    var value = this.get(attr)
    var output = []

    value.split(' ').forEach(function (v, i) {
      if (v === 'other') {
        output[i] = window.u.capitalize(this.get(attr_other))
      } else {
        output[i] = window.t(attr + '.' + v)
      }
    }, this)

    return output.join(', ')
  }
})
