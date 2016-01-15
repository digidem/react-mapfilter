// MapFilter.js 0.1.0
// ==================

//     (c) 2013-2014 Gregor MacLennan, Digital Democracy
//     MapFilter may be freely distributed under the MIT license.

// Initial Setup
// -------------
//
//
'use strict'

var Backbone = require('backbone')

var Auth = require('./auth.js')
var MapPane = require('./map_pane/map_pane.js')
var PrintPane = require('./print_pane/print_pane.js')
var FilterPane = require('./filter_pane/filter_pane.js')
var InfoPane = require('./info_pane/info_pane.js')

module.exports = Backbone.View.extend({
  events: {
    'click': 'closeGraphPane'
  },

  initialize: function (options) {
    var self = this
    this.auth = new Auth(options.auth, function (token) {
      self.collection.setToken(token)
      return self.fetchCollectionData(token)
    })

    this.mapPane = new MapPane({
      id: 'map',
      center: options.mapCenter,
      zoom: options.mapZoom,
      tileUrl: options.tileUrl,
      bingKey: options.bingKey,
      collection: this.collection,
      appView: this,
      interactive: true
    })

    this.printPane = new PrintPane({
      id: 'print-pane',
      center: options.mapCenter,
      zoom: options.mapZoom,
      tileUrl: options.tileUrl,
      bingKey: options.bingKey,
      collection: this.collection,
      scrollWheelZoom: false
    })

    this.filterPane = new FilterPane({
      id: 'filter-pane',
      collection: this.collection,
      filters: options.filters
    })

    this.infoPane = new InfoPane({
      id: 'info-pane'
    })

    this.listenTo(this.filterPane.graphPane, 'opened', this.openGraphPane)
    this.listenTo(this.filterPane.graphPane, 'closed', this.closeGraphPane)

    this.listenTo(this.filterPane, 'print-preview', this.showPrintView)
    this.listenTo(this.printPane, 'cancel', this.removePrintView)

    this.listenTo(this.collection, 'error', function (collection, response, options) {
      if (response.status > 400 && response.status < 500) {
        window.alert('invalid github token')
        self.auth.trigger('logout')
      } else {
        console.error(response)
      }
    })

    this.$el.append(this.mapPane.el)
    this.$el.append(this.filterPane.render().el)
    this.$el.append(this.infoPane.$el.hide())

    // When the Leaflet Map is first initialized, it is not attached to the DOM
    // and does not have a width. We need to reset the size here now it is attached.
    this.mapPane.map.invalidateSize()
  },

  fetchCollectionData: function (token) {
    // trigger collection firstfetch
    this.collection.fetch({
      silent: true,
      success: function (collection, resp, options) {
        collection.trigger('firstfetch', collection, resp, options)
      }
    })
  },

  openGraphPane: function () {
    this.$el.addClass('show-date-filter')
  },

  closeGraphPane: function () {
    this.$el.removeClass('show-date-filter')
  },

  showPrintView: function () {
    this.mapPane.$el.addClass('hide')
    this.filterPane.$el.addClass('hide')
    this.infoPane.$el.addClass('hide')

    this.$el.append(this.printPane.el)
    this.printPane.render()
  },

  removePrintView: function () {
    this.mapPane.$el.removeClass('hide')
    this.filterPane.$el.removeClass('hide')
    this.infoPane.$el.removeClass('hide')

    this.printPane.$el.detach()
  }
})
