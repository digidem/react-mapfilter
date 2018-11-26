import base64Url from 'base64-url'
import isodate from '@segment/isodate'
import dehumanizeDate from 'dehumanize-date'

import {
  FIELD_TYPE_SPACE_DELIMITED,
  FIELD_TYPE_ARRAY,
  FIELD_TYPE_STRING_OR_ARRAY,
  FIELD_TYPE_NUMBER_OR_ARRAY
} from '../constants'

// const iso8601RegExp = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/

const shortDateRegExp = /^(\d{4})-(\d{2})-(\d{2})$/

/**
 * Attempt to parse a datestring, returning `false` if it can't be parsed
 * @param {string} possibleDate [description]
 * @return {date|boolean} returns a Date object or `false` if not a date.
 */
export function parseDate (value) {
  if (shortDateRegExp.test(value)) {
    var m = value.match(shortDateRegExp)
    value = (new Date(m[1], m[2] - 1, m[3])).toISOString()
  }
  var dateString = dehumanizeDate(value)
  return dateString == null ? false : new Date(dateString)
}

export function isDate (v) {
  if (v instanceof Date) return true
  if (typeof v !== 'string') return false
  return isodate.is(v) || dehumanizeDate(v) != null
}

export function isArrayLike (type) {
  switch (type) {
    case FIELD_TYPE_SPACE_DELIMITED:
    case FIELD_TYPE_ARRAY:
    case FIELD_TYPE_STRING_OR_ARRAY:
    case FIELD_TYPE_NUMBER_OR_ARRAY:
      return true
    default:
      return false
  }
}

/**
 * Encode an object into a URL safe base64 string
 * @param {object} filter Any object to encode
 * @return {string} URL safe base64 encoded string
 */
export function encodeFilter (filter) {
  return base64Url.encode(Buffer.from(JSON.stringify(filter)))
}

/**
 * Decode URL safe base64String to an object
 * @param {string} base64String base64 encoded string
 * @return {object} decoded object
 */
export function decodeFilter (base64String) {
  return JSON.parse(base64Url.decode(base64String).toString())
}
