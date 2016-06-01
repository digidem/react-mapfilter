const { createSelector } = require('reselect')
const urlRegex = require('url-regex')({exact: true})
const url = require('url')
const path = require('path')

const getFlattenedFeatures = require('./flattened_features')
const {FIELD_TYPES, FILTER_TYPES} = require('../constants')

// Max number of unique text values for a field to still be a filterable discrete field
const MAX_DISCRETE_VALUES = {
  string: 15,
  number: 5
}

const imageExts = ['jpg', 'tif', 'jpeg', 'png', 'tiff', 'webp']
const videoExts = ['mov', 'mp4', 'avi']
const filterableTypes = [
  FIELD_TYPES.DATE,
  FIELD_TYPES.STRING,
  FIELD_TYPES.NUMBER,
  FIELD_TYPES.BOOLEAN
]

function wc (s) {
  return s.split(/ |_/).length
}

function isFilterable (type) {
  return filterableTypes.indexOf(type) > -1
}

/**
 * Reducer that computes running mean, variance, min and max
 * Adapted from http://www.johndcook.com/blog/standard_deviation/
 * @param {Object} p The previous value for the analysis
 * @param {Number} x New value to be included in analysis
 * @param {Number} i Index of the current element being processed
 * @return {Object} New analysis including `x`
 */
function statReduce (p = {mean: NaN, vari: NaN, min: +Infinity, max: -Infinity}, x, i) {
  p.mean = isNaN(p.mean) ? 0 : p.mean
  const mean = p.mean + (x - p.mean) / (i + 1)
  return {
    mean: mean,
    min: x < p.min ? x : p.min,
    max: x > p.max ? x : p.max,
    vari: i < 1 ? 0 : (p.vari * i + (x - p.mean) * (x - mean)) / (i + 1)
  }
}

function isMediaField (f) {
  return [FIELD_TYPES.VIDEO, FIELD_TYPES.IMAGE, FIELD_TYPES.MEDIA].indexOf(f.type) > -1
}

/**
 * Reducer that returns 'mixed' if values are not all the same,
 * or 'media' if field is a mixture of image and video files
 * @param {any} p Previous value
 * @param {any} v Current value
 * @return {any} `v` or `mixed`
 */
function typeReduce (p, v) {
  if (!p || v === p) return v
  if (isMediaField(p) && isMediaField(v)) {
    return FIELD_TYPES.MEDIA
  } else {
    return FIELD_TYPES.MIXED
  }
}

function valuesReduce (p = {}, v) {
  let keyCount = Object.keys(p).length
  let valueType = getType(v)
  p[v] = typeof p[v] === 'undefined' ? 1 : p[v] + 1
  if (keyCount > (MAX_DISCRETE_VALUES[valueType] || MAX_DISCRETE_VALUES.string)) return p
  return p
}

function getFilterType (f) {
  const keyCount = f.values && Object.keys(f.values).length
  if (!isFilterable(f.type)) return
  // No point in having a filter for only one value
  if (keyCount === 1) return
  switch (f.type) {
    case FIELD_TYPES.DATE:
      return FILTER_TYPES.DATE
    case FIELD_TYPES.NUMBER:
      if (keyCount <= MAX_DISCRETE_VALUES.number) {
        return FILTER_TYPES.DISCRETE
      } else {
        f.values = undefined
        return FILTER_TYPES.RANGE
      }
    case FIELD_TYPES.BOOLEAN:
      return FILTER_TYPES.DISCRETE
    case FIELD_TYPES.STRING:
      if (keyCount <= MAX_DISCRETE_VALUES.string) {
        return FILTER_TYPES.DISCRETE
      } else {
        f.values = undefined
        return FILTER_TYPES.TEXT
      }
  }
}

/**
 * Guess if a field is a UUID: if it has a length greater than
 * 30, no variance in length, and is only one word.
 * @param {[type]} f [description]
 * @return {Boolean} [description]
 */
function isUuid (f) {
  if (f.type !== 'string') return
  return f.lengthStats.mean > 30 &&
    f.lengthStats.vari === 0 &&
    f.wordStats.max === 1
}

/**
 * Returns the type of a value, guessing types `date`, `link`, `image`, `video`
 * @param {any} v Type to be evaluated
 * @return {string} One of `string`, `number`, `bool`, `date`, `link`, `image`, `video`
 */
function getType (v) {
  if (v instanceof Date) return FIELD_TYPES.DATE
  if (typeof v === 'string' && urlRegex.test(v)) {
    const pathname = url.parse(v).pathname
    const ext = path.extname(pathname).slice(1)
    if (imageExts.indexOf(ext) > -1) return FIELD_TYPES.IMAGE
    if (videoExts.indexOf(ext) > -1) return FIELD_TYPES.VIDEO
    return FIELD_TYPES.LINK
  }
  if (typeof v === 'string' && /^uuid:/.test(v)) return FIELD_TYPES.UUID
  return typeof v
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
const getFieldAnalysis = createSelector(
  getFlattenedFeatures,
  function analyzeFields (features) {
    const analysis = {}
    // Iterate over every feature in the FeatureCollection
    for (let i = 0; i < features.length; i++) {
      // For each feature, iterate over its properties
      let properties = features[i].properties
      let keys = Object.keys(properties)
      for (let j = 0; j < keys.length; j++) {
        let value = properties[keys[j]]
        let field = analysis[keys[j]] = analysis[keys[j]] || {fieldname: keys[j]}
        field.type = typeReduce(field.type, getType(value))
        field.count = (field.count || 0) + 1
        if (!isFilterable(field.type)) continue
        if (field.type === FIELD_TYPES.STRING) {
          field.wordStats = statReduce(field.wordStats, wc(value), i)
          field.lengthStats = statReduce(field.lengthStats, value.length, i)
        }
        if (field.type === FIELD_TYPES.NUMBER || field.type === FIELD_TYPES.DATE) {
          field.valueStats = statReduce(field.valueStats, value, i)
        }
        field.values = valuesReduce(field.values, value)
      }
    }
    for (let fieldname in analysis) {
      let field = analysis[fieldname]
      if (isUuid(field)) {
        field.type = FIELD_TYPES.UUID
        field.values = undefined
      }
      field.filterType = getFilterType(field)
    }
    return analysis
  }
)

module.exports = getFieldAnalysis
