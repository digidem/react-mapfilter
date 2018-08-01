// @flow
import isodate from '@segment/isodate'
import urlRegex from 'url-regex'
import url from 'url'
import path from 'path'

import * as fieldTypes from '../constants/field_types.js'

const shortDateRegExp = /^(\d{4})-(\d{2})-(\d{2})$/

const TYPES = {
  boolean: fieldTypes.BOOLEAN,
  number: fieldTypes.NUMBER,
  undefined: fieldTypes.UNDEFINED
}

const IMAGE_EXTS = ['jpg', 'tif', 'jpeg', 'png', 'tiff', 'webp']
const VIDEO_EXTS = ['mov', 'mp4', 'avi', 'webm']
const AUDIO_EXTS = ['3gpp', 'wav', 'wma', 'mp3', 'm4a', 'aiff', 'ogg']

/**
 * Given a value, guess a field type
 */
export function guessType(value: any): $Values<typeof fieldTypes> {
  if (Array.isArray(value)) return fieldTypes.ARRAY
  if (value === null) return fieldTypes.NULL
  if (typeof value !== 'string') return TYPES[typeof value]

  if (urlRegex({ exact: true }).test(value)) {
    const pathname = url.parse(value).pathname
    const ext = path.extname(pathname || '').slice(1)
    if (IMAGE_EXTS.indexOf(ext) > -1) return fieldTypes.IMAGE
    if (VIDEO_EXTS.indexOf(ext) > -1) return fieldTypes.VIDEO
    if (AUDIO_EXTS.indexOf(ext) > -1) return fieldTypes.AUDIO
    return fieldTypes.URL
  }
  if (isDate(value)) return fieldTypes.DATE

  return fieldTypes.STRING
}

/**
 * Attempt to parse a datestring, returning `null` if it can't be parsed
 * @param {string} possibleDate [description]
 * @return {date|boolean} returns a Date object or `false` if not a date.
 */
export function parseDate(value: string) {
  if (shortDateRegExp.test(value)) {
    var m = value.match(shortDateRegExp)
    // $FlowFixMe
    value = new Date(+m[1], +m[2] - 1, +m[3]).toISOString()
  }
  return isodate.is(value) ? isodate.parse(value) : null
}

export function isDate(v: any) {
  if (v instanceof Date) return true
  if (typeof v !== 'string') return false
  if (shortDateRegExp.test(v)) return true
  return isodate.is(v)
}
