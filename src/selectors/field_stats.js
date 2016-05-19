const { createSelector } = require('reselect')

const getFlattenedFeatures = require('./flattened_features')

// Max number of unique text values for a field to still be a filterable discrete field
const MAX_DISCRETE_VALUES = {
  string: 15,
  number: 5
}

/**
 * get max of `a`, `b` preferring b if a is `undefined`
 */
function getMax (a, b) {
  return typeof a === 'undefined' ? b : b > a ? b : a
}

function getMin (a, b) {
  return typeof a === 'undefined' ? b : b < a ? b : a
}

/**
 * Analyzes the fields of features in a featureCollection and guesses the
 *   field type and what type of filter to use: `discrete`, `number`,
 *   `date` (subtype of continuous), or `text` (and field that has more than
 *   `maxTextValues` discrete values). Number fields with <= `maxNumberCount`
 *   different values are considered discrete.
 * @param {object} featureCollection GeoJson FeatureCollection
 * @return {object} An object with a key for each unique field name in the
 *   FeatureCollection with properties `type` of filter to use, a count for
 *   each discrete option, or a min/max for continuous fields
 */
const getFieldStats = createSelector(
  getFlattenedFeatures,
  function analyzeFields (features) {
    const stats = {}
    // Iterate over every feature in the FeatureCollection
    for (let i = 0; i < features.length; i++) {
      // For each feature, iterate over its properties
      let properties = features[i].properties
      let keys = Object.keys(properties)
      for (let j = 0; j < keys.length; j++) {
        let key = keys[j]
        let value = properties[key]
        let valueType = (value instanceof Date) ? 'date' : typeof value
        let field = stats[key] = stats[key] || {values: {}}
        field.max = getMax(field.max, value)
        field.min = getMin(field.min, value)
        if (!field.type) {
          field.type = valueType
        } else if (field.type !== valueType) {
          field.type = 'mixed'
        }
        let keyCount = Object.keys(field.values).length
        if (keyCount <= (MAX_DISCRETE_VALUES[valueType] || MAX_DISCRETE_VALUES.string)) {
          // Keep a count of how many of each value for discrete fields
          let valueCount = field.values[value]
          field.values[value] = typeof valueCount === 'undefined' ? 1 : valueCount + 1
        }
      }
    }
    const fieldNames = Object.keys(stats)
    // Clean up filter fields object to remove unnecessary props
    for (let k = 0; k < fieldNames.length; k++) {
      let filterType = 'discrete'
      let field = stats[fieldNames[k]]
      let keyCount = Object.keys(field.values).length
      if (field.type === 'date') {
        filterType = 'date'
        delete field.values
      } else if (keyCount > (MAX_DISCRETE_VALUES[field.type] || MAX_DISCRETE_VALUES.string)) {
        if (field.type === 'string') {
          filterType = 'text'
          delete field.values
          delete field.min
          delete field.max
        } else if (field.type === 'number') {
          filterType = 'range'
          delete field.values
        } else {
          delete stats[fieldNames[k]]
        }
      }
      field.filterType = filterType
    }
    return stats
  }
)

module.exports = getFieldStats
