// MapFilter.InfoPane
// ------------------

// The InfoPane manages the display of the attributes and media associated
// with a point. It appears on mouseover/hover of a point, but if you click
// the point then it will "stick" open.
'use strict'

var $ = require('jquery')
var _ = require('lodash')

var ImageCache = require('./image_cache.js')
var ImageRotator = require('./image_rotate.js')
var tpl = require('../../../templates/info-pane.tpl')

module.exports = require('backbone').View.extend({
  events: {
    'click .close': 'close'
  },

  initialize: function (options) {
    options = options || {}
    if (options.id) this.$el.attr('id', options.id)
    this.template = tpl

    this.imageCache = new ImageCache()
    this.imageRotator = ImageRotator()
  },

  // Populates the infopane contents with the data from the selected point
  render: function () {
    this.$el.html(this.template(this.model))
    this.$('.map-icon').html($(this.model.icon).html())
    this.$('.map-icon').addClass($(this.model.icon).attr('class'))
    return this
  },

  // load image from cache, and rotated based on exif headers
  show: function (options) {
    if (this.sticky()) return
    this.hide()
    this.sticky(options.sticky)

    this.model = options.model
    this.iconView = options.iconView

    this.render()
    this.$el.show()

    var imageUrl = _.result(this.model, 'getImage')
    console.log(imageUrl)

    this.imageCache.getOrDownload(imageUrl, function (blob) {
      console.log('getOrDownload callback', blob)
      var objectUrl = URL.createObjectURL(blob)
      // save objectUrl to model image
      this.model.getImage = objectUrl

      // apply exif rotation with css
      this.imageRotator(objectUrl, function (cssTransform) {
        console.log('rotation', cssTransform)

        this.$el.find('.image-wrapper img').style('transform', cssTransform)
      })

    })
  },

  toggle: function (options) {
    this.sticky(false)
    if (this.iconView === options.iconView) {
      this.hide()
      this.iconView = null
    } else {
      if (this.iconView) this.iconView.$el.removeClass('clicked')
      this.show(options)
    }
  },

  sticky: function (sticky) {
    if (typeof sticky === 'undefined') return this._sticky
    if (sticky) {
      this.$el.addClass('sticky')
    } else {
      this.$el.removeClass('sticky')
    }
    this._sticky = sticky
  },

  close: function () {
    this.sticky(false)
    if (this.iconView) this.iconView.$el.removeClass('hover clicked')
    this.hide()
  },

  hide: function () {
    if (this.sticky()) return
    this.$el.hide()
  }
})
