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
function analyzeFields (features, {maxTextValues = 15, maxNumberCount = 5} = {}) {
  // TODO: What about mixed fields? e.g. number and string values for the same
  // field? Need to check whether this would give a meaningful result.
  const fields = {}
  // Iterate over every feature in the FeatureCollection
  for (let i = 0; i < features.length; i++) {
    // For each feature, iterate over its properties
    let properties = features[i].properties
    let keys = Object.keys(properties)
    for (let j = 0; j < keys.length; j++) {
      let key = keys[j]
      // Attempt to parse the property as a date
      let date = parseDate(properties[key])
      let value = date || properties[key]
      let valueType = typeof value
      // We can filter date, number, boolean and string fields, but not
      // objects (nested values) or arrays right now
      let isFilterable = date || ['number', 'boolean', 'string'].indexOf(valueType) > -1
      if (isFilterable) {
        // Add to list of filterable fields
        let field = fields[key] = fields[key] || {values: {}}
        // Check the number of discrete values for each field - don't
        // make a discrete filter for more than 15 discrete values
        let count = Object.keys(field.values).length
        if (date || (valueType === 'number' && count > maxNumberCount) || (valueType === 'string' && count > maxTextValues)) {
          if (date || valueType === 'number') {
            // Store min and max values of continuous fields
            field.max = !field.max ? value : value > field.max ? value : field.max
            field.min = !field.min ? value : value < field.min ? value : field.min
            field.type = 'number'
          } else {
            // TODO: We don't do any analysis for text fields, perhaps inplement
            // a word cloud or similar?
            field.type = 'text'
          }
        } else {
          // Keep a count of how many of each value for discrete fields
          let valueCount = field.values[value]
          field.values[value] = typeof valueCount === 'undefined' ? 1 : valueCount + 1
          field.type = 'discrete'
        }
      }
    }
  }
  const fieldNames = Object.keys(fields)
  // Clean up filter fields object to remove unnecessary props
  for (let k = 0; k < fieldNames.length; k++) {
    let fieldType = fields[fieldNames[k]].type
    if (fieldType !== 'discrete') {
      delete fields[fieldNames[k]].values
    } else if (Object.keys(fields[fieldNames[k]].values).length < 2) {
      delete fields[fieldNames[k]]
    }
  }
  return fields
}

/**
 * Check if valid filter (see https://www.mapbox.com/mapbox-gl-style-spec/#types-filter)
 * @param {array} filter [description]
 * @return {Boolean} `true` if filter is supported
 */
// function isSupportedFilter (filter = [], supportedFilterOps = []) {
//   let supported = true

//   function checkOpSupported (exp) {
//     if (supportedFilterOps.indexOf(exp[0]) === -1) {
//       console.warn('Unsupported filter (map will still render):', JSON.stringify(filter))
//       supported = false
//     }
//     if (exp[1] instanceof Array) {
//       exp.slice(1).forEach(checkOpSupported)
//     }
//   }

//   checkOpSupported(filter)
//   return supported
// }

/**
 * Returns a merged list of: (a) fields that are appear in `filter` and
 * (b) fields in the array `filterFields`
 * @param {array} filter       Mapbox feature-filter expression
 * @param {array} filterFields Array of field names
 * @return {array} merged list of fields
 */
function mergeFilterFields (filter, filterFields = []) {
  const mergedFields = filterFields.slice(0)
  if (!filter) return mergedFields

  function addFilteredFields (exp) {
    if (exp[1] instanceof Array) {
      exp.slice(1).forEach(addFilteredFields)
    } else if (typeof exp[1] === 'string' && mergedFields.indexOf(exp[1]) < 0) {
      mergedFields.push(exp[1])
    }
  }

  addFilteredFields(filter)
  return mergedFields
}

/**
 * Parses filter expressions and returns them indexed by field name.
 * Checks filter expression is valid, throws an error if not
 * @param {array} filter Mapbox feature-filter expression
 * @return {object} filter expressions by field name
 */
function getFiltersByField (filter) {
  const filtersByField = {}
  if (!filter) return filtersByField
  let compoundOp = null

  function addFilterExpressions (exp) {
    if (exp[1] instanceof Array && exp[0] === 'all') {
      compoundOp = exp[0]
      exp.slice(1).forEach(addFilterExpressions)
      compoundOp = null
      return
    }
    if (compoundOp === 'all') {
      if (!(exp[0] === '>=' || exp[0] === '<=' || exp[0] === 'in')) {
        throw new Error("Only 'in', '>=' or '<=' operators are supported within an 'all' compound filter")
      }
    }
    if (!compoundOp && ['in', '<=', '>='].indexOf(exp[0]) < 0) {
      throw new Error('Only \'in\', \'>=\' or \'>=\' operators are supported at this time')
    }

    const v = exp[0] === 'in' ? exp.slice(2) : exp[2]
    if (filtersByField[exp[1]]) {
      filtersByField[exp[1]][exp[0]] = v
    } else {
      filtersByField[exp[1]] = {[exp[0]]: v}
    }
  }

  addFilterExpressions(filter)
  return filtersByField
}

/**
 * Builds a valid mapbox-gl filter expression from an object:
 *   `{foo: {in: 'bar', 'baz'}, qux: {'>=': 1, '<=': 3}}`
 *   Effectively does the opposite of `getFiltersByField`. It is not 1-to-1,
 *   but filters should be functionally equivalent
 * @param {object} filtersByField
 * @return {array} valid mapbox-gl filter
 */
function buildFilter (filtersByField) {
  return Object.keys(filtersByField).reduce(function (p, f) {
    const exp = filtersByField[f]
    if (exp.in) {
      p.push(['in', f, ...exp.in])
    } else if (exp['<='] || exp['>=']) {
      const compoundExp = ['all']
      if (exp['<=']) compoundExp.push(['<=', f, exp['<=']])
      if (exp['>=']) compoundExp.push(['>=', f, exp['>=']])
      p.push(compoundExp)
    }
    return p
  }, ['all'])
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
  analyzeFields,
  buildFilter,
  parseDate,
  mergeFilterFields,
  getFiltersByField,
  encodeFilter,
  decodeFilter
}
