// Exif orientation value to css transform mapping
// Does not include flipped orientations
// based on https://gist.github.com/runeb/c11f864cd7ead969a5f0

module.exports = function (buffer, callback) {
  var rotation = {
    1: 'rotate(0deg)',
    3: 'rotate(180deg)',
    6: 'rotate(90deg)',
    8: 'rotate(270deg)'
  }

  return function (buffer, callback) {
    var scanner = new DataView(buffer)
    var idx = 0
    var value = 1 // Non-rotated is the default
    if (buffer.length < 2 || scanner.getUint16(idx) !== 0xFFD8) {
      // Not a JPEG
      if (callback) {
        callback(rotation[value])
      }
      return
    }
    idx += 2
    var maxBytes = scanner.byteLength
    while (idx < maxBytes - 2) {
      var uint16 = scanner.getUint16(idx)
      idx += 2
      switch (uint16) {
        case 0xFFE1: // Start of EXIF
          var exifLength = scanner.getUint16(idx)
          maxBytes = exifLength - idx
          idx += 2
          break
        case 0x0112: // Orientation tag
          // Read the value, its 6 bytes further out
          // See page 102 at the following URL
          // http://www.kodak.com/global/plugins/acrobat/en/service/digCam/exifStandard2.pdf
          value = scanner.getUint16(idx + 6, false)
          maxBytes = 0 // Stop scanning
          break
      }
    }
    if (callback) {
      callback(rotation[value])
    }
  }
}

