var CacheBlobStore = require('cache-blob-store')
var _ = require('lodash')

module.exports = require('backbone').View.extend({
  initialize: function () {
    this.cache = new CacheBlobStore()
    this.queue = {}

    console.log('image_cache initialize')
  },

  getOrDownload: function (url, cb) {
    var self = this
    var cache = this.cache

    // set callback to receive load events
    self.listenTo(self, 'load', cb)

    console.log('queue', this.queue)
    // first, check if url exists in cache
    cache.exists(url, function (err, exists) {
      if (err) { console.error('cache.exists', err) }

      console.log('url exists?', url, exists)
      if (exists) {
        // it exists in cache
        console.log('getting', url)

        cache.get(url, function (err, blob) {
          if (err) { console.error('cache.get', err) }
          console.log('got', url, blob)
          // we've got it, trigger callback with load event
          self.trigger('load', blob)
          return true
        })
      } else {
        // check if there is already a request pending
        var requested = _.contains(_.keys(self.queue), url)
        if (requested) {
          console.log('queue contains', url)
          return true
        } else {
          // start a download request
          cache.download(url, function (err, metadata) {
            if (err) { console.error('cache.download', err) }

            cache.get(url, function (err, blob) {
              if (err) { console.error('cache.get 2', err) }

              // remove pending request from queue
              console.log('queue delete', url)
              delete self.queue[url]

              // we've got it, trigger callback with load event
              self.trigger('load', blob)
              return true
            })
          })

          // add request time to queue
          console.log('queue add', url)
          self.queue[url] = new Date()
        }
      }
    })
  }
})
