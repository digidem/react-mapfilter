// @flow
import isodate from '@segment/isodate'
import sexagesimal from '@mapbox/sexagesimal'
import { URL } from 'url'
import path from 'path'

import * as valueTypes from '../../constants/value_types'
type Primitive = boolean | null | void | string | number

// Match dates of the form 1999-12-31
const shortDateRegExp = /^(\d{4})-(\d{2})-(\d{2})$/

const TYPES = {
  boolean: valueTypes.BOOLEAN,
  number: valueTypes.NUMBER,
  undefined: valueTypes.UNDEFINED
}

const IMAGE_EXTS = ['jpg', 'tif', 'jpeg', 'png', 'tiff', 'webp']
const VIDEO_EXTS = ['mov', 'mp4', 'avi', 'webm']
const AUDIO_EXTS = ['3gpp', 'wav', 'wma', 'mp3', 'm4a', 'aiff', 'ogg']

/**
 * Guess the type of a value:
 * - primitive types (excluding Symbol)
 * - dates
 * - urls (guessing contentType from extension)
 * - locations (as [lon, lat] arrays, sexaguessimal coordinates, or location
 *   strings from ODK collect)
 */
export default function guessValueType(
  value: Primitive | Array<Primitive>
): $Values<typeof valueTypes> {
  if (parseLocation(value) !== null) return valueTypes.LOCATION
  if (Array.isArray(value)) return valueTypes.ARRAY
  if (value === null) return valueTypes.NULL
  if (typeof value !== 'string') return TYPES[typeof value]

  if (isUrl(value)) {
    const parsedUrl = new URL(value)
    const ext = path
      .extname(parsedUrl.pathname || '')
      .slice(1)
      .toLowerCase()
    if (IMAGE_EXTS.indexOf(ext) > -1) return valueTypes.IMAGE_URL
    if (VIDEO_EXTS.indexOf(ext) > -1) return valueTypes.VIDEO_URL
    if (AUDIO_EXTS.indexOf(ext) > -1) return valueTypes.AUDIO_URL
    return valueTypes.URL
  }

  // Test date last because this is the most expensive
  if (shortDateRegExp.test(value)) return valueTypes.DATE
  if (isodate.is(value)) return valueTypes.DATETIME

  return valueTypes.STRING
}

/**
 * Parses location from one of:
 * - a string location record from an ODK form
 * - a sexagesimal pair e.g. `66N 32W`
 * - an array [lon, lat] of either numbers or strings which can be coerced to numbers
 */
function parseLocation(value: any): [number, number] | null {
  if (typeof value === 'string') {
    var parsed = sexagesimal.pair(value)
    if (parsed) return [parsed[1], parsed[0]]
    const parts = value.split(' ')
    // ODK location is a string like `-77.23 2.24 10 200` (lon, lat, accuracy, altitude)
    if (parts.length !== 4) return null
    if (parts.every(isFloat) && withinBounds(+parts[0], +parts[1])) {
      return parts.map(parseFloat).slice(0, 2)
    }
  } else if (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every(isFloat) &&
    withinBounds(+value[0], +value[1])
  ) {
    return value.map(parseFloat).slice(0, 2)
  }
  return null
}

// Stricter parsing function, from
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
function isFloat(value: string | number) {
  if (typeof value === 'number') return true
  return /^(-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)
}

// Check whether a location is within bounds
function withinBounds(lon: number, lat: number) {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180
}

function isUrl(url: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}
