// @flow
import { flatten } from '../../utils/flat'
import * as valueTypes from '../../constants/value_types'
import {
  guessValueType,
  coerceValue as throwableCoerceValue
} from './value_types'
import { get, set } from '../../utils/dot_prop'

import type {
  JSONObject,
  FieldStatistic,
  Statistics,
  MediaArray,
  Field,
  TextField,
  LinkField,
  NumberField,
  DateField,
  DateTimeField,
  SelectOptions,
  SelectOneField,
  SelectMultipleField,
  SelectableFieldValue
} from '../../types'

function coerceValue(...args) {
  try {
    return throwableCoerceValue.apply(null, args)
  } catch (e) {}
}

export { default as createMemoizedStats } from './statistics'

const mediaTypes = [
  valueTypes.VIDEO_URL,
  valueTypes.AUDIO_URL,
  valueTypes.IMAGE_URL
]

/**
 * Takes a JSON object and optional array of JSON objects and returns an array
 * of field definitions. The field definitions are guessed from the arguments
 * passed. The returned field definitions can be used to render fields for
 * editing the properties of the object.
 */
export function getFields(
  cur?: JSONObject = {},
  stats?: Statistics
): Array<Field> {
  const flattened = flatten(cur, { delimiter: '\uffff' })
  const keys: Array<string> = stats
    ? Object.keys(stats)
    : Object.keys(flattened)
  return keys.sort().reduce((acc, key) => {
    const value = flattened[key]
    const fieldStats = stats && stats[key]
    const field = getField(key, value, fieldStats)
    if (field) acc.push(field)
    return acc
  }, [])
}

export function getMedia(cur: JSONObject = {}): MediaArray {
  const flattened = flatten(cur, { delimiter: '\uffff' })
  return Object.keys(flattened).reduce((acc, key) => {
    const value = flattened[key]
    const type = guessValueType(value)
    if (mediaTypes.includes(type)) {
      // $FlowFixMe flow does not understand type is only media type here
      acc.push({ src: value, type })
    }
    return acc
  }, [])
}

export function getField(
  key: string,
  value: any,
  fieldStats?: FieldStatistic
): Field | void {
  const valueType = guessValueType(value)
  // Initial implementation does not try to guess from statistics
  switch (valueType) {
    case valueTypes.BOOLEAN:
      return createSelectOneField(key, [true, false])
    case valueTypes.STRING:
      const options = getOptions(fieldStats)
      if (options.length) return createSelectOneField(key, options)
      else return createTextField(key)
    case valueTypes.NUMBER:
      return createNumberField(key)
    case valueTypes.ARRAY:
      return createSelectMultipleField(key, value, { readonly: true })
    case valueTypes.DATE:
      return createDateField(key)
    case valueTypes.DATETIME:
      return createDateTimeField(key)
    case valueTypes.URL:
    case valueTypes.IMAGE_URL:
    case valueTypes.AUDIO_URL:
    case valueTypes.VIDEO_URL:
      return createLinkField(key)
    default:
      return createTextField(key, { readonly: true })
  }
}

// Don't include long strings in the options that can be selected
const MAX_OPTION_LENGTH = 30

function getOptions(fieldStats?: FieldStatistic): SelectOptions {
  const options = []
  if (!fieldStats) return options

  for (let value of fieldStats.string.values.keys()) {
    if (value.length > MAX_OPTION_LENGTH) continue
    options.push(value)
  }

  return options
}

function createTextField(
  key: string,
  {
    readonly = false,
    appearance = 'single',
    snakeCase = false
  }: {
    readonly?: boolean,
    appearance?: 'single' | 'multiline',
    snakeCase?: boolean
  } = {}
): TextField {
  const keyArray = key.split('\uffff')
  return {
    id: key,
    key: key,
    readonly: readonly,
    appearance: appearance,
    type: 'text',
    get: (obj: {}) => {
      const val = get(obj, keyArray)
      return coerceValue(val, valueTypes.STRING)
    },
    set: (obj: {}, value: string) => {
      if (snakeCase) value = value.replace(' ', '_').toLowerCase()
      return set(obj, keyArray, value)
    }
  }
}

function createLinkField(key: string): LinkField {
  const keyArray = key.split('\uffff')
  return {
    id: key,
    key: key,
    readonly: true,
    type: 'link',
    get: (obj: {}) => coerceValue(get(obj, keyArray), valueTypes.STRING),
    set: (obj: {}, value: string) => set(obj, keyArray, value)
  }
}

function createNumberField(
  key: string,
  { readonly = false }: { readonly?: boolean } = {}
): NumberField {
  const keyArray = key.split('\uffff')
  return {
    id: key,
    key: key,
    label: key,
    readonly: readonly,
    type: 'number',
    get: (obj: {}) => coerceValue(get(obj, keyArray), valueTypes.NUMBER),
    set: (obj: {}, value: number) => set(obj, keyArray, value)
  }
}

function createSelectOneField(
  key: string,
  options: SelectOptions,
  {
    readonly = false,
    snakeCase = false
  }: { readonly?: boolean, snakeCase?: boolean } = {}
): SelectOneField {
  const keyArray = key.split('\uffff')
  return {
    id: key,
    key: key,
    label: key,
    readonly: readonly,
    type: 'select_one',
    options: options,
    get: (obj: {}) => get(obj, keyArray),
    set: (obj: {}, value: SelectableFieldValue) => {
      if (snakeCase && typeof value === 'string')
        value = value.replace(' ', '_').toLowerCase()
      return set(obj, keyArray, value)
    }
  }
}

function createSelectMultipleField(
  key: string,
  options: SelectOptions,
  {
    readonly = false,
    snakeCase = false
  }: { readonly?: boolean, snakeCase?: boolean } = {}
): SelectMultipleField {
  const keyArray = key.split('\uffff')
  return {
    id: key,
    key: key,
    label: key,
    readonly: readonly,
    type: 'select_multiple',
    options: options,
    get: (obj: {}) => coerceValue(get(obj, keyArray), valueTypes.ARRAY),
    set: (obj: {}, value: Array<SelectableFieldValue>) => {
      if (snakeCase)
        value.map(item =>
          typeof item === 'string' ? item.replace(' ', '_').toLowerCase() : item
        )
      return set(obj, keyArray, value)
    }
  }
}

function createDateField(
  key: string,
  {
    readonly = false,
    min,
    max
  }: {
    readonly?: boolean,
    snakeCase?: boolean,
    min?: number,
    max?: number
  } = {}
): DateField {
  const keyArray = key.split('\uffff')
  return {
    id: key,
    key: key,
    label: key,
    readonly: readonly,
    type: 'date',
    get: (obj: {}) => coerceValue(get(obj, keyArray), valueTypes.DATE),
    set: (obj: {}, value: Date) => {
      const dateString =
        value.getFullYear() + '-' + value.getMonth() + '-' + value.getDate()
      return set(obj, keyArray, dateString)
    }
  }
}

function createDateTimeField(
  key: string,
  {
    readonly = false,
    min,
    max
  }: {
    readonly?: boolean,
    snakeCase?: boolean,
    min?: number,
    max?: number
  } = {}
): DateTimeField {
  const keyArray = key.split('\uffff')
  return {
    id: key,
    key: key,
    label: key,
    readonly: readonly,
    type: 'datetime',
    get: (obj: {}) => coerceValue(get(obj, keyArray), valueTypes.DATETIME),
    set: (obj: {}, value: Date) => {
      const dateString = value.toISOString()
      return set(obj, keyArray, dateString)
    }
  }
}
