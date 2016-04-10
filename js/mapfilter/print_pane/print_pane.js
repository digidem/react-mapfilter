'use strict'

var $ = require('jquery')
var MapPane = require('../map_pane/map_pane.js')
var InfoPane = require('../info_pane/info_pane.js')
var tpl = require('../template.js')('print-pane.tpl')

module.exports = require('backbone').View.extend({
  events: {
    'click .print': 'print',
    'click .cancel': 'cancel',
    'click input[value=show-large-map]': 'showMap',
    'click input[value=show-info]': 'showInfo'
  },

  initialize: function (options) {
    this.infoPanesByCid = {}
    this.template = tpl

    this.$el.html(this.template({
      infoPanes: []
    }))

    this.$filterPanesEl = this.$('#info-panes-print')

    this.mapPane = new MapPane({
      el: this.$('#map-print'),
      center: options.center,
      zoom: options.zoom,
      tileUrl: options.tileUrl,
      collection: this.collection,
      bingKey: options.bingKey,
      scrollWheelZoom: false
    })
  },

  render: function () {
    this.mapPane.map.invalidateSize()
    // Change map bounds if any records are currently filtered
    if (this.collection.dimensionByCid.groupAll().value()) {
      this.mapPane.map.fitBounds(this.collection.filteredBounds())
    }

    this.$filterPanesEl.html('')

    this.collection.groupByCid.all().forEach(function (d) {
      var cid = d.key,
        model = this.collection.get(cid)

      // Only show info for unfiltered records
      if (d.value > 0) {
        var infoPane = this.infoPanesByCid[cid] || new InfoPane({
            className: 'info-print-view',
            model: model,
            collection: this.collection
          }).render()

        infoPane.$('.map-icon').html($(model.icon).html())
        infoPane.$('.map-icon').addClass($(model.icon).attr('class'))

        this.infoPanesByCid[cid] = infoPane
        this.$filterPanesEl.append(infoPane.el)
      }
    }, this)

    return this
  },

  print: function () {
    window.stop()
    window.print()
    this.cancel()
  },

  cancel: function () {
    this.trigger('cancel')
  },

  showMap: function () {
    this.$('.first-page').toggle()
  },

  showInfo: function () {
    this.$filterPanesEl.toggle()
  }
})
