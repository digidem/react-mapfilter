// @flow
import isodate from '@segment/isodate'
import urlRegex from 'url-regex'
import url from 'url'
import path from 'path'
import sexagesimal from '@mapbox/sexagesimal'
import chrono from 'chrono-node'

import { flatten } from '../utils/flat'
import * as valueTypes from '../constants/value_types'
import * as fieldTypes from '../constants/field_types'

import type {
  PointFeature,
  FieldDefinition,
  Statistic,
  NumberStatistic,
  StringStatistic
} from '../types'

const shortDateRegExp = /^(\d{4})-(\d{2})-(\d{2})$/

const TYPES = {
  boolean: valueTypes.BOOLEAN,
  number: valueTypes.NUMBER,
  undefined: UNDEFINED
}

const IMAGE_EXTS = ['jpg', 'tif', 'jpeg', 'png', 'tiff', 'webp']
const VIDEO_EXTS = ['mov', 'mp4', 'avi', 'webm']
const AUDIO_EXTS = ['3gpp', 'wav', 'wma', 'mp3', 'm4a', 'aiff', 'ogg']

export default function guessFieldDefinitions(
  feature: PointFeature,
  features: Array<PointFeature>
): Array<FieldDefinition> {
  const flattenedProps = flatten(feature.properties || {}, {
    delimiter: '\uffff'
  })
  const fieldStats = getFieldStatistics(features)
  return Object.keys(flattenedProps)
    .sort()
    .map(key => {
      const value = flattenedProps[key]
      const valueType = guessValueType(value)
      const fieldType = guessFieldType(key, value, valueType, fieldStats)
      const fieldDefinition = {
        key: key,
        valueType: valueType,
        fieldType: fieldType,
        strict: false
      }
      return fieldDefinition
    })
}

function getFieldStatistics(
  features: Array<PointFeature>
): {
  $type: NumberStatistic
} {}

/**
 * Given a value, guess a field type
 */
function guessValueType(
  value: any
): $Values<typeof valueTypes> | typeof NULL | typeof UNDEFINED {
  if (Array.isArray(value)) return valueTypes.ARRAY
  if (value === null || value === NULL) return NULL
  if (typeof value !== 'string') return TYPES[typeof value]
  if (value === UNDEFINED) return UNDEFINED

  if (urlRegex({ exact: true }).test(value)) {
    const pathname = url.parse(value).pathname
    const ext = path.extname(pathname || '').slice(1)
    if (IMAGE_EXTS.indexOf(ext) > -1) return valueTypes.IMAGE_URL
    if (VIDEO_EXTS.indexOf(ext) > -1) return valueTypes.VIDEO_URL
    if (AUDIO_EXTS.indexOf(ext) > -1) return valueTypes.AUDIO_URL
    return valueTypes.URL
  }
  if (isDate(value)) return valueTypes.DATE

  return valueTypes.STRING
}

/**
 * Parses location from one of:
 * - a string location record from an ODK form
 * - a sexagesimal pair e.g. `66N 32W`
 * - an array [lon, lat] of either numbers or strings which can be coerced to numbers
 */
function parseLocation(value: string | Array<any>): [number, number] | null {
  if (typeof value === 'string') {
    var parsed = sexagesimal.pair(value)
    if (parsed) return [parsed[1], parsed[0]]
    const parts = value.split(' ')
    // ODK location is a string like `-77.23 2.24 10 200` (lon, lat, accuracy, altitude)
    if (parts.length !== 4) return null
    if (parts.every(isFloat) && withinBounds(+parts[0], +parts[1]))
      // $FlowFixMe - flow doesn't understand parts.length above
      return parts.map(parseFloat).slice(0, 2)
  } else if (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every(isFloat) &&
    withinBounds(+value[0], +value[1])
  ) {
    // $FlowFixMe - flow doesn't understand parts.length above
    return value.map(parseFloat).slice(0, 2)
  }
  return null
}

// Stricter parsing function, from
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
function isFloat(value: string | number) {
  if (typeof value === 'number') return true
  return /^(-|\+)?([0-9]+(\.[0-9]+)|Infinity)$/.test(value)
}

function withinBounds(lat: number, lon: number) {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180
}

/**
 * Attempt to parse a datestring, returning `null` if it can't be parsed
 * @param {string} possibleDate [description]
 * @return {date|boolean} returns a Date object or `false` if not a date.
 */
function parseDate(value: string) {
  if (shortDateRegExp.test(value)) {
    var m = value.match(shortDateRegExp)
    if (!m || m.length < 4) return null
    value = new Date(+m[1], +m[2] - 1, +m[3]).toISOString()
  }
  return isodate.is(value) ? isodate.parse(value) : null
}

function isDate(v: any) {
  if (v instanceof Date) return true
  if (typeof v !== 'string') return false
  if (shortDateRegExp.test(v)) return true
  return isodate.is(v)
}

const URL_TYPES = [
  valueTypes.URL,
  valueTypes.MEDIA_URL,
  valueTypes.AUDIO_URL,
  valueTypes.VIDEO_URL,
  valueTypes.IMAGE_URL
]
const STRING_TYPES = [valueTypes.STRING, valueTypes.UUID]

/**
 * Attempts to coerce a value to `fieldType`, returns null if it can't coerce
 */
function coerceValue(
  value: any,
  fieldType: $Values<typeof valueTypes>
): Date | number | string | boolean | null | [number, number] {
  const valueType = guessValueType(value)
  if (valueType === fieldType) return value

  // Attempt to coerce strings to a date
  if (fieldType === valueTypes.DATE) {
    let parsedDate = null
    if (valueType === valueTypes.STRING) {
      parsedDate = chrono.strict.parseDate(value)
    }
    return parsedDate
  }

  if (fieldType === valueTypes.LOCATION) {
    let parsedLocation = null
    if (valueType === valueTypes.ARRAY || valueType === valueTypes.STRING) {
      // We try to parse a location from a string
      parsedLocation = parseLocation(value)
    }
    return parsedLocation
  }

  if (fieldType === valueTypes.BOOLEAN) {
    let parsedBoolean = null
    if (valueType === valueTypes.NUMBER) {
      parsedBoolean = !!value
    } else if (valueType === valueTypes.STRING) {
      parsedBoolean = parseBoolean(value)
    }
    return parsedBoolean
  }

  if (fieldType === valueTypes.NUMBER) {
    let parsedNumber = null
    if (valueType === valueTypes.STRING) {
      parsedNumber = Number(value)
    }
    return Number.isNaN(parsedNumber) ? null : parsedNumber
  }

  if (URL_TYPES.indexOf(fieldType) > -1 && URL_TYPES.indexOf(valueType) > -1) {
    return value
  }

  if (STRING_TYPES.indexOf(fieldType) > -1) {
    if (valueType === UNDEFINED || valueType === NULL) return ''
    else return value + ''
  }

  return null
}

const TRUE_STRINGS = ['yes', 'true', '1']
const FALSE_STRINGS = ['no', 'false', '0']

function parseBoolean(value: string) {
  const v = value.toLowerCase()
  if (TRUE_STRINGS.indexOf(v) > -1) return true
  if (FALSE_STRINGS.indexOf(v) > -1) return false
  return null
}
