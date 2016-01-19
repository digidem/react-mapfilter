var CacheBlobStore = require('cache-blob-store')

module.exports = require('backbone').View.extend({
  initialize: function () {
    this.cache = new CacheBlobStore()
  },

  getOrDownload: function (url, cb) {
    var self = this
    var cache = this.cache

    // set callback to receive load events
    self.listenTo(self, 'load', cb)

    cache.exists(url, function (err, exists) {
      if (err) { console.log('err in exists'); console.error(err) }

      if (exists) {
        console.log('url exists')
        cache.get(url, function (err, blob) {
          if (err) { console.log('err in get 1'); console.error(err) }
          console.log('got blob', blob)
          self.trigger(self, 'load', blob)
        })
      } else {
        console.log('url does not exist, cache it')
        cache.download(url, function (err, metadata) {
          console.log('url downloaded')
          if (err) { console.log('err in download'); console.error(err) }

          cache.get(url, function (err, blob) {
            console.log('retrieved blob')
            if (err) { console.log('err in get 2'); console.error(err) }

            self.trigger(self, 'load', blob)
          })
        })
      }
    })
  }
})
