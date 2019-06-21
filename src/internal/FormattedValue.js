// @flow
import React from 'react'
import { FormattedDate } from 'react-intl'
import roundTo from 'round-to'
import { fromLatLon } from 'utm'
import sexagesimal from '@mapbox/sexagesimal'

import { SettingsConsumer, ValueTranslationConsumer } from './Context'
import { guessValueType, parseDate, coerceValue } from '../utils/field_types'
import { translateOrPretty } from '../utils/strings'

import * as VALUE_TYPES from '../constants/value_types'
import * as COORD_FORMATS from '../constants/coord_formats'
import { LOCATION } from '../constants/special_fieldkeys'

type Props = {
  // The field (prop) name including a dot-separated heirarchy e.g.
  // `{ foo: { bar: 'qux' } }` has a fieldkey `foo.bar`
  // The fieldkey is used to look up any user (custom) translations which are
  // passed in by using the FieldnameTranslationProvider
  fieldkey?: string,
  // The field value to format
  value: any,
  // The field type, this can be defined for a dataset, but the actual field
  // value could be a different type, e.g. a field with type "date" could have a
  // field with value undefined or a string which is not a valid date
  type?: $Values<typeof VALUE_TYPES>
}

/**
 * Format a value from a form, either by guessing the type or trying to coerce
 * the value to a type specified by `fieldType`. An optional `fieldkey` is used
 * to look up a translated value which can be passed by FieldnameTranslationProvider
 */
const FormattedValue = ({ fieldkey, value, type: fieldType }: Props) => {
  if (fieldkey === LOCATION) fieldType = VALUE_TYPES.LOCATION
  // The type of the value could be different than the type of the field
  let valueType = guessValueType(value)
  let coercedValue

  if (valueType !== fieldType && fieldType) {
    coercedValue = coerceValue(value, fieldType)
    if (coercedValue !== null) {
      valueType = fieldType
      value = coercedValue
    }
  }

  switch (valueType) {
    case VALUE_TYPES.DATE:
      const parsedDate = parseDate(value)
      if (parsedDate === null) return value
      return (
        <FormattedDate
          value={parsedDate}
          year="numeric"
          month="long"
          day="2-digit"
        />
      )
    case VALUE_TYPES.LOCATION:
      return (
        <SettingsConsumer>
          {({ coordFormat }) => formatLocation(value, coordFormat)}
        </SettingsConsumer>
      )
    case VALUE_TYPES.NUMBER:
    case VALUE_TYPES.UUID:
      return value
    case VALUE_TYPES.IMAGE_URL:
    case VALUE_TYPES.VIDEO_URL:
    case VALUE_TYPES.MEDIA_URL:
    case VALUE_TYPES.AUDIO_URL:
    case VALUE_TYPES.URL:
      return (
        <a href={value} target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      )
    case VALUE_TYPES.STRING:
    case VALUE_TYPES.BOOLEAN:
    case NULL:
    case UNDEFINED:
      return (
        <ValueTranslationConsumer>
          {translations =>
            translateOrPretty(value, fieldkey ? translations[fieldkey] : {})
          }
        </ValueTranslationConsumer>
      )
    case VALUE_TYPES.ARRAY:
      return value.map((v, i) => (
        <React.Fragment key={i}>
          <FormattedValue fieldkey={fieldkey} value={v} />
          {i + 1 === value.length ? '' : ', '}
        </React.Fragment>
      ))
  }
}

export default FormattedValue

function formatLocation(
  coords: [number, number],
  format: $Values<typeof COORD_FORMATS>
) {
  if (!(Array.isArray(coords) && coords.length === 2)) return coords
  switch (format) {
    case COORD_FORMATS.DEC_DEG:
      return coords.map(coord => roundTo(coord, 5)).join(', ')
    case COORD_FORMATS.DEG_MIN_SEC:
      return sexagesimal
        .formatPair({ lon: coords[0], lat: coords[1] })
        .replace(/'/g, '’')
        .replace(/"/g, '”')
    case COORD_FORMATS.UTM:
      const utm = fromLatLon(coords[1], coords[0])
      return `X ${roundTo(utm.easting, 1)}, Y ${roundTo(
        utm.northing,
        1
      )} — UTM ${utm.zoneNum}${utm.zoneLetter}`
  }
}
