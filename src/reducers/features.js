const fs = require('fs')
const path = require('path')
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

const markersJson = fs.readFileSync(path.join(__dirname, '/../../statics/sample.geojson'), 'utf8')
const markers = JSON.parse(markersJson, reviveDate).features

const features = (state = markers, action) => {
  switch (action.type) {
    case 'ADD_FEATURES':
      return [...state, ...action.payload]
    case 'REPLACE_FEATURES':
      return action.payload
  }
  return state
}

module.exports = features
