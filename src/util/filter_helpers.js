const base64Url = require('base64-url')

// const iso8601RegExp = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/

/**
 * Attempt to parse a datestring, returning `false` if it can't be parsed
 * @param {string} possibleDate [description]
 * @return {date|boolean} returns a Date object or `false` if not a date.
 */
function parseDate (possibleDate) {
  if (typeof possibleDate !== 'string') return false
  var date = new Date(possibleDate)
  if (isNaN(date)) return false
  return date
}

/**
 * Encode an object into a URL safe base64 string
 * @param {object} filter Any object to encode
 * @return {string} URL safe base64 encoded string
 */
function encodeFilter (filter) {
  return base64Url.encode(new Buffer(JSON.stringify(filter)))
}

/**
 * Decode URL safe base64String to an object
 * @param {string} base64String base64 encoded string
 * @return {object} decoded object
 */
function decodeFilter (base64String) {
  return JSON.parse(base64Url.decode(base64String).toString())
}

module.exports = {
  parseDate,
  encodeFilter,
  decodeFilter
}
