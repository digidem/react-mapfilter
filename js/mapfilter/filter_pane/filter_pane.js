/* global t, app */
// MapFilter.FilterPane
// --------------------

// The FilterPane shows the list of filters that can be used to explore data.
// It creates a filter view for each filter in the array `options.filters`
// which should have the following properties:
//
// - `field` is the field/attribute to filter by
// - `type` should be `discrete` for string data and `continuous` for numbers or dates
// - `expanded` sets whether the filter view is expanded or collapsed by default
'use strict'

var $ = require('jquery')
var _ = require('lodash')

var GraphPane = require('./graph_pane.js')
var ContinuousFilterView = require('./continuous_filter_view.js')
var DiscreteFilterView = require('./discrete_filter_view.js')

var shpWrite = require('shp-write')
var json2csv = require('json2csv')

module.exports = require('backbone').View.extend({
  events: {
    'click .print-preview': 'showPrintPreview',
    'click .download-shp': 'downloadSHP',
    'click .download-csv': 'downloadCSV',
    'click .auth-logout': 'authLogout',
    'click .import-filter': 'importFilter',
    'change select.filters': 'selectFilter',
    'click button.sync': 'sync'
  },

  initialize: function (options) {
    this.filters = options.filters || []
    this.config = options.config

    // Initialize a graph pane to hold charts for continuous filters
    this.graphPane = new GraphPane({
      collection: this.collection
    })
  },

  render: function () {
    var filters = this.filters
    this.$el.html('<div/>')

    // Append the graph parent to this pane's parent
    this.$el.append(this.graphPane.render().el)

    this.$filters = $('<form class="form"/>').appendTo(this.el)

    // Loop through each filter and add a view to the pane
    filters.forEach(function (filter) {
      this.addFilter(filter)
    }, this)

    this.$filters.append(
      '<div class="msg"></div>' +
      '<div class="btn-group">' +
        '<button type="button" class="btn btn-default dropdown-toggle"' +
           'data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
          t('ui.filter_pane.actions') + '<span class="caret"></span>' +
        '</button>' +
        '<ul class="dropdown-menu">' +
          '<li><a href="#" class="print-preview">' + t('ui.filter_pane.print_report') + '</a></li>' +
          '<li><a href="#" class="download-shp">' + t('ui.filter_pane.download_shp') + '</a></li>' +
          '<li><a href="#" class="download-csv">' + t('ui.filter_pane.download_csv') + '</a></li>' +
          '<li role="separator" class="divider"></li>' +
          '<li><a href="#" class="auth-logout">' + t('ui.filter_pane.log_out') + '</a></li>' +
        '</ul>' +
      '</div>' + `
      <div class="sync">
        <div class="filters"></div>
        <div>
          <button class="import-filter">import filter</button>
        </div>
        <div>
          <button class="sync">sync</button>
        </div>
      </div>`
    )
    var self = this
    this.config.listenTo(this.config, 'filters', function (filters) {
      var el = self.$filters.find('.filters')
      if (filters.length === 0) return el.html('')
      el.html(`<select class="filters">
        ${filters.map(function (filter) {
          return Object.keys(filter.values).map(function (key) {
            return `<option value="${key}">${filter.key.split('/')[1]}</option>`
          })
        })}
      </select>`)
      self.selectFilter({
        target: self.$filters.find('select.filters')
      })
    })
    var msgEl = self.$filters.find('.msg')
    this.config.listenTo(this.config, 'replication-start', function () {
      msgEl.text('replication started')
    })
    this.config.listenTo(this.config, 'replication-start', function () {
      msgEl.text('replication complete')
    })
    this.config.listenTo(this.config, 'imported', function (docs) {
      msgEl.text('imported ' + docs.length + ' reports')
    })
    return this

  },
  importFilter: function (ev) {
    ev.preventDefault()
    this.config.trigger('import-filter')
  },

  sync: function (ev) {
    ev.preventDefault()
    this.config.trigger('sync')
  },

  selectFilter: function (ev) {
    config.selectFilter(ev.target.value)
  },

  // Add a filter on a field to the filter pane.
  addFilter: function (options) {
    var filterView

    if (!options.field) {
      console.error(t('error.filter_missing'))
      return
    }

    // Initialize a ContinuousFilterView or DiscreteFilterView
    // ContinousFilterView is linked to the GraphPane which will show
    // the bar chart for selecting ranges of data
    if (options.type === 'continuous') {
      filterView = new ContinuousFilterView({
        collection: this.collection,
        field: options.field,
        expanded: options.expanded || false,
        graphPane: this.graphPane
      })
    } else {
      filterView = new DiscreteFilterView({
        collection: this.collection,
        field: options.field,
        expanded: options.expanded || false
      })
    }

    this.$filters.append(filterView.render().el)
  },

  // hide elements
  showPrintPreview: function () {
    this.trigger('print-preview')
  },

  downloadSHP: function () {
    var options = {
      folder: 'monitoring_points',
      types: {
        point: 'monitoring_points'
      }
    }
    var geojson = this.collection.toJSON()

    shpWrite.download(geojson, options)
  },

  downloadCSV: function () {
    var geojson = this.collection.toJSON()

    // flatten properties and coordinates
    var flatArray = _.map(geojson.features, function (feature) {
      // omit _private, meta, picture
      var properties = _.omit(feature.properties, function (value, key, object) {
        // TODO, make image field configurable
        return (key[0] === '_' || _.contains(['meta', 'picture'], key))
      })

      // flatten picture url
      properties.pictureUrl = JSON.parse(feature.properties.picture).url

      // flatten coordinates
      properties.latitude = feature.geometry.coordinates[0]
      properties.longitude = feature.geometry.coordinates[1]
      return properties
    })

    json2csv({data: flatArray}, function (err, csv) {
      if (err) console.log(err)

      window.location.href = 'data:octet/stream;charset=utf-8,' + encodeURI(csv)
      // TODO, this file download mechanism doesn't let us set filename
      // replace with fileSaver.js ?
    })
  },

  authLogout: function () {
    app.auth.trigger('logout')
  }
})
