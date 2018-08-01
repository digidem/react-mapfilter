// @flow
import React from 'react'
import { defineMessages, FormattedDate } from 'react-intl'
import roundTo from 'round-to'
import { fromLatLon } from 'utm'
import sexagesimal from '@mapbox/sexagesimal'

import { Consumer as FieldTranslationConsumer } from './FieldTranslationContext'
import { Consumer as SettingsConsumer } from './SettingsContext'
import { guessType, parseDate } from '../utils/field_types'
import { translateOrPretty } from '../utils/strings'

import * as fieldTypes from '../constants/field_types'
import * as coordFormats from '../constants/coord_formats'
import { UNDEFINED } from '../constants/field_values'

const msgs = defineMessages({
  true: 'Yes',
  false: 'No',
  null: '[No Value]',
  undefined: '[No Value]'
})

type Props = {
  fieldkey?: string,
  value: any,
  type?: $Values<typeof fieldTypes>
}

const FormattedValue = ({ fieldkey, value, type: fieldType }: Props) => {
  // The type of the value could be different than the type of the field
  const valueType = guessType(value)
  switch (type) {
    case fieldTypes.DATE:
      return (
        <FormattedDate
          value={parseDate(value)}
          year="numeric"
          month="long"
          day="2-digit"
        />
      )
    case fieldTypes.LOCATION:
      return (
        <SettingsConsumer>
          {({ coordFormat }) => formatLocation(value, coordFormat)}
        </SettingsConsumer>
      )
    case fieldTypes.NUMBER:
      return value === UNDEFINED ? '' : value + ''
    case fieldTypes.UUID:
    case fieldTypes.FILENAME:
      return value
    case fieldTypes.IMAGE:
    case fieldTypes.VIDEO:
    case fieldTypes.MEDIA:
    case fieldTypes.AUDIO:
    case fieldTypes.URL:
      return (
        <a href={value} target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      )
  }
  return (
    <FieldTranslationConsumer>
      {({ valueTranslations: translations }) =>
        translateOrPretty(value, fieldkey ? translations[fieldkey] : {})
      }
    </FieldTranslationConsumer>
  )
}

export default FormattedValue

function formatLocation(
  coords: [number, number],
  format: $Values<typeof coordFormats>
) {
  if (!(Array.isArray(coords) && coords.length === 2)) return coords
  switch (format) {
    case coordFormats.DEC_DEG:
      return coords.map(coord => roundTo(coord, 5)).join(', ')
    case coordFormats.DEG_MIN_SEC:
      return sexagesimal
        .formatPair({ lon: coords[0], lat: coords[1] })
        .replace(/'/g, '’')
        .replace(/"/g, '”')
    case coordFormats.UTM:
      const utm = fromLatLon(coords[1], coords[0])
      return `X ${roundTo(utm.easting, 1)}, Y ${roundTo(
        utm.northing,
        1
      )} — UTM ${utm.zoneNum}${utm.zoneLetter}`
  }
}
