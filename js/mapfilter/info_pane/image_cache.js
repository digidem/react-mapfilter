var CacheBlobStore = require('cache-blob-store')
var _ = require('lodash')

module.exports = require('backbone').View.extend({
  initialize: function () {
    this.cache = new CacheBlobStore()
    this.queue = []
  },

  getOrDownload: function (url, cb) {
    var self = this
    var cache = this.cache

    // set callback to receive load events
    self.listenTo(self, 'load', cb)

    console.log(this.queue)
    cache.exists(url, function (err, exists) {
      if (err) { console.error('cache.exists', err) }

      var requested = _.contains(self.queue, url)
      if (exists || requested) {
        cache.get(url, function (err, blob) {
          if (err) { console.error('cache.get', err) }

          self.trigger('load', blob)
          return true
        })
      } else {
        self.queue.push(url)
        cache.download(url, function (err, metadata) {
          if (err) { console.error('cache.download', err) }

          cache.get(url, function (err, blob) {
            if (err) { console.error('cache.get', err) }

            self.trigger('load', blob)
            return true
          })
        })
      }
    })
  }
})
