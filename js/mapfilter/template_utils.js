module.exports = {
  // Converts a string to sentence case
  capitalize: function (s) {
    s = s || ''
    // Matches the first letter in the string and the first letter that follows a
    // period (and 1 or more spaces) and transforms that letter to uppercase.
    return s.replace(/(^[a-z])|(\.\s*[a-z])/g, function (s) { return s.toUpperCase() })
  },

  splitSpace: function (s) {
    return s.split(' ').join(', ')
  },

  parseDate: function (s) {
    var d = s.split('-')
    return new Date(d[0], d[1] - 1, d[2])
  }
}
