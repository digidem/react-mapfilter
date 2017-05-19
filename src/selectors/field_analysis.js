import { createSelector } from 'reselect'
import makeUrlRegex from 'url-regex'
import url from 'url'
import path from 'path'

import {
  FIELD_TYPE_STRING,
  FIELD_TYPE_BOOLEAN,
  FIELD_TYPE_NUMBER,
  FIELD_TYPE_DATE,
  FIELD_TYPE_MIXED,
  FIELD_TYPE_UUID,
  FIELD_TYPE_IMAGE,
  FIELD_TYPE_VIDEO,
  FIELD_TYPE_MEDIA,
  FIELD_TYPE_AUDIO,
  FIELD_TYPE_LINK,
  FIELD_TYPE_ARRAY,
  FIELD_TYPE_STRING_OR_ARRAY,
  FIELD_TYPE_NUMBER_OR_ARRAY,
  FIELD_TYPE_FILENAME,
  FIELD_TYPE_UNDEFINED,
  FIELD_TYPE_NULL,
  FILTER_TYPE_DISCRETE,
  FILTER_TYPE_RANGE,
  FILTER_TYPE_DATE,
  FILTER_TYPE_TEXT
} from '../constants'

import {parseDate, isDate} from '../util/filter_helpers'
import getFlattenedFeatures from './flattened_features'

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
  state => state.fieldTypes,
  function analyzeFields (features, fieldTypes) {
    var props
    var feature
    var keys
    var i
    var j
    var value
    var fieldname
    var field
    var geometryType

    var analysis = {
      properties: {},
      $id: {},
      $type: {}
    }

    // Iterate over every feature in the FeatureCollection
    // This is performance critical, so we use for loops instead of Array.reduce
    for (i = 0; i < features.length; i++) {
      feature = features[i]
      props = feature.properties || {}
      keys = Object.keys(props)
      for (j = 0; j < keys.length; j++) {
        value = props[keys[j]]
        fieldname = keys[j]
        field = analysis.properties[fieldname] = analysis.properties[fieldname] || {fieldname: fieldname}
        analyzeField(field, value, i)
      }
      analyzeField(analysis.$id, feature.id, i)
      geometryType = feature.geometry && feature.geometry.type
      analyzeField(analysis.$type, geometryType, i)
    }

    for (fieldname in analysis.properties) {
      field = analysis.properties[fieldname]
      field.isUnique = isUnique(field, features.length)
      if (isUUIDField(field)) field.type = FIELD_TYPE_UUID
      field.filterType = getFilterType(field)
      if (field.filterType === FILTER_TYPE_DISCRETE && field.count < features.length) {
        // Add count of undefined values
        field.values.undefined = (field.values.undefined || 0) + (features.length - field.count)
      }
      if (field.filterType !== FILTER_TYPE_DISCRETE) {
        // Free up memory if we're not going to use field.values
        field.values = null
      } else {
        field.values = parseMapValues(field.values)
      }
      field.type = fieldTypes[fieldname] || field.type
    }

    analysis.$id.isUnique = isUnique(analysis.$id, features.length)
    analysis.$id.values = null
    analysis.$type.filterType = getFilterType(analysis.$type)
    analysis.$type.values = parseMapValues(analysis.$type.values)

    return analysis
  }
)

export default getFieldAnalysis

const urlRegex = makeUrlRegex({exact: true})

// Max number of unique text values for a field to still be a filterable discrete field
const MAX_DISCRETE_VALUES = {
  [FIELD_TYPE_STRING]: 15,
  [FIELD_TYPE_NUMBER]: 5
}

const imageExts = ['jpg', 'tif', 'jpeg', 'png', 'tiff', 'webp']
const videoExts = ['mov', 'mp4', 'avi', 'webm']
const audioExts = ['3gpp', 'wav', 'wma', 'mp3', 'm4a', 'aiff', 'ogg']
const mediaExts = imageExts.concat(videoExts, audioExts)

const types = {
  'string': FIELD_TYPE_STRING,
  'boolean': FIELD_TYPE_BOOLEAN,
  'number': FIELD_TYPE_NUMBER,
  'undefined': FIELD_TYPE_UNDEFINED
}

const isFilterable = {
  [FIELD_TYPE_DATE]: true,
  [FIELD_TYPE_STRING]: true,
  [FIELD_TYPE_NUMBER]: true,
  [FIELD_TYPE_BOOLEAN]: true,
  [FIELD_TYPE_ARRAY]: true,
  [FIELD_TYPE_STRING_OR_ARRAY]: true,
  [FIELD_TYPE_NUMBER_OR_ARRAY]: true
}

const isMediaField = {
  [FIELD_TYPE_VIDEO]: true,
  [FIELD_TYPE_IMAGE]: true,
  [FIELD_TYPE_MEDIA]: true
}

const isStringOrArray = {
  [FIELD_TYPE_STRING]: true,
  [FIELD_TYPE_ARRAY]: true,
  [FIELD_TYPE_STRING_OR_ARRAY]: true
}

const isNumberOrArray = {
  [FIELD_TYPE_NUMBER]: true,
  [FIELD_TYPE_ARRAY]: true,
  [FIELD_TYPE_NUMBER_OR_ARRAY]: true
}

function analyzeField (field, value, i) {
  var type = getType(value)
  field.type = typeReduce(field.type, type)
  field.count = (field.count || 0) + 1
  if (!isFilterable[field.type]) return
  if (type === FIELD_TYPE_STRING) {
    field.wordStats = statReduce(field.wordStats, wc(value), i)
    field.lengthStats = statReduce(field.lengthStats, value.length, i)
  } else if (type === FIELD_TYPE_ARRAY) {
    field.maxArrayLength = Math.max(field.maxArrayLength || 1, value.length)
  } else if (type === FIELD_TYPE_NUMBER) {
    field.valueStats = statReduce(field.valueStats, value, i)
  } else if (type === FIELD_TYPE_DATE) {
    field.valueStats = statReduce(field.valueStats, parseDate(value), i)
  }
  field.values = valuesReduce(field.values, value)
}

function wc (s) {
  return s.split(' ').length
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
  x = x instanceof Date ? +x : x
  return {
    mean: mean,
    min: x < p.min ? x : p.min,
    max: x > p.max ? x : p.max,
    vari: i < 1 ? 0 : (p.vari * i + (x - p.mean) * (x - mean)) / (i + 1)
  }
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
  if (isMediaField[p] && isMediaField[v]) {
    return FIELD_TYPE_MEDIA
  } else if (isMediaField[p] && (v === FIELD_TYPE_LINK ||
    v === FIELD_TYPE_UNDEFINED || v === FIELD_TYPE_NULL || v === FIELD_TYPE_FILENAME)) {
    // If this contains media + links, assume the links are to the same type of media
    // media field might also have a string filename if image is lost
    return p
  } else if (isMediaField[v] && (p === FIELD_TYPE_LINK ||
    p === FIELD_TYPE_UNDEFINED || p === FIELD_TYPE_NULL || p === FIELD_TYPE_FILENAME)) {
    // If this contains media + links, assume the links are to the same type of media
    return v
  } else if (p === FIELD_TYPE_LINK && (isMediaField[v] ||
    p === FIELD_TYPE_UNDEFINED || p === FIELD_TYPE_NULL)) {
    return v
  } else if (isStringOrArray[p] && isStringOrArray[v]) {
    return FIELD_TYPE_STRING_OR_ARRAY
  } else if (isNumberOrArray[p] && isNumberOrArray[v]) {
    return FIELD_TYPE_NUMBER_OR_ARRAY
  } else {
    return FIELD_TYPE_MIXED
  }
}

/**
 * Reducer that returns the count of each value for a field
 * @param {Object} p Accumulator
 * @param {Any} v Any value
 * @return {Object} An object with a key for each value and the count of that value
 */
function valuesReduce (p = {}, v) {
  v = Array.isArray(v) ? v : [v]
  v.forEach(function (w) {
    w = JSON.stringify(w)
    p[w] = typeof p[w] === 'undefined' ? 1 : p[w] + 1
  })
  return p
}

/**
 * Return the filter type for a field `f`.
 * @param {Object} f A field object with analysis props
 * @return {String} Filter type: date, range, discrete or text
 */
function getFilterType (f) {
  const keyCount = f.values && Object.keys(f.values).length
  if (!isFilterable[f.type]) return
  switch (f.type) {
    case FIELD_TYPE_DATE:
      return FILTER_TYPE_DATE
    case FIELD_TYPE_NUMBER:
      if (keyCount <= MAX_DISCRETE_VALUES[FIELD_TYPE_NUMBER]) {
        return FILTER_TYPE_DISCRETE
      } else {
        return FILTER_TYPE_RANGE
      }
    case FIELD_TYPE_BOOLEAN:
      return FILTER_TYPE_DISCRETE
    case FIELD_TYPE_STRING:
      // Strings with lots of words we count as text fields, not discrete fields
      if (f.wordStats.mean > 1) {
        return FILTER_TYPE_TEXT
      }
    // eslint-disable-next-line no-fallthrough
    case FIELD_TYPE_ARRAY:
    case FIELD_TYPE_STRING_OR_ARRAY:
    case FIELD_TYPE_NUMBER_OR_ARRAY:
      if (keyCount <= MAX_DISCRETE_VALUES[FIELD_TYPE_STRING]) {
        return FILTER_TYPE_DISCRETE
      } else {
        return FILTER_TYPE_TEXT
      }
  }
}

/**
 * Returns the type of a value, guessing types `date`, `link`, `image`, `video`
 * @param {any} v Value to be evaluated
 * @return {string} Field type
 */
function getType (v) {
  if (Array.isArray(v)) return FIELD_TYPE_ARRAY
  if (v === null) return FIELD_TYPE_NULL
  if (typeof v !== 'string') return types[typeof v]
  // isDate() is the most expensive test, so we do it as little as possible
  if (isDate(v)) return FIELD_TYPE_DATE
  if (urlRegex.test(v)) {
    const pathname = url.parse(v).pathname
    const ext = path.extname(pathname).slice(1)
    if (imageExts.indexOf(ext) > -1) return FIELD_TYPE_IMAGE
    if (videoExts.indexOf(ext) > -1) return FIELD_TYPE_VIDEO
    if (audioExts.indexOf(ext) > -1) return FIELD_TYPE_AUDIO
    return FIELD_TYPE_LINK
  }
  const ext = path.extname(v).slice(1)
  if (v.split('/').length === 1 && mediaExts.indexOf(ext) > -1) return FIELD_TYPE_FILENAME
  return FIELD_TYPE_STRING
}

/**
 * We initially process values as a map value -> count,
 * with the value encoded with JSON.stringify() so that
 * it is not coerced to a string when set as an object property.
 * This function parses those values back to their original
 * type and turns the values map into a sorted array
 */
function parseMapValues (values) {
  if (!values) return []
  return Object.keys(values).sort().map(function (v) {
    var parsed
    if (v === 'undefined') {
      parsed = v
    } else {
      try {
        parsed = JSON.parse(v)
      } catch (e) {
        console.error('problem parsing', v)
      }
    }
    return {value: parsed, count: values[v]}
  })
}

/**
 * Is a field unique?
 * @param {object} field        A field object with analysis props
 * @param {number} featureCount Total number of features
 * @return {Boolean}
 */
function isUnique (field, featureCount) {
  const valueCount = field.values && Object.keys(field.values).length
  return featureCount === valueCount
}

/**
 * Guess if a field is a UUID: if it is unique, has a length greater than
 * 30, no variance in length, and is only one word.
 */
function isUUIDField (f) {
  if (!f.isUnique) return
  if (f.type !== FIELD_TYPE_STRING) return
  return f.lengthStats.mean > 30 &&
    f.lengthStats.vari === 0 &&
    f.wordStats.max === 1
}
