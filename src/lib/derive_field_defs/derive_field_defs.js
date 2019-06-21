// @flow

import { flatten } from '../../utils/flat'
import * as valueTypes from '../../constants/value_types'
// import * as fieldTypes from '../constants/field_types'

import type {
  JSONObject,
  FieldDefinition,
  Statistic,
  NumberStatistic,
  StringStatistic
} from '../../types'

/**
 * Takes a JSON object and optional array of JSON objects and returns an array
 * of field definitions. The field definitions are guessed from the arguments
 * passed. The returned field definitions can be used to render fields for
 * editing the properties of the object.
 */
export default function guessFieldDefinitions(
  cur: JSONObject = {},
  all: Array<JSONObject> = []
): Array<FieldDefinition> {
  const flattened = flatten(cur, { delimiter: '\uffff' })
  const fieldStats = getFieldStatistics(all)
  return Object.keys(flattened)
    .sort()
    .map(key => {
      const value = flattened[key]
      const valueType = guessValueType(value)
      // const fieldType = guessFieldType(key, value, valueType, fieldStats)
      const fieldDefinition = {
        key: key,
        valueType: valueType,
        // fieldType: fieldType,
        strict: false
      }
      return fieldDefinition
    })
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
    if (valueType === valueTypes.UNDEFINED || valueType === valueTypes.NULL)
      return ''
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
