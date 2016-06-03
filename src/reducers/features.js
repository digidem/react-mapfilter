const fs = require('fs')

/**
 * Attempt to parse a datestring, returning `false` if it can't be parsed
 * @param {string} possibleDate [description]
 * @return {date|boolean} returns a Date object or `false` if not a date.
 */
function reviveDate (k, v) {
  if (typeof v !== 'string') return v
  var date = new Date(v)
  if (isNaN(date)) return v
  return date
}

const markersJson = fs.readFileSync(__dirname + '/../../test/fixtures/markers.json', 'utf8')
const markers = JSON.parse(markersJson, reviveDate).features

const features = (state = markers, action) => {
  switch (action.type) {
    case 'ADD_FEATURE':
      return [...state, action.payload]
  }
  return state
}

module.exports = features
