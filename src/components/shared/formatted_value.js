import React from 'react'
import {FormattedMessage, FormattedDate} from 'react-intl'
import roundTo from 'round-to'
import {fromLatLon} from 'utm'
import sexagesimal from '@mapbox/sexagesimal'

import {parseDate} from '../../util/filter_helpers'
import {createMessage as msg} from '../../util/intl_helpers'
import {
  FIELD_TYPE_DATE,
  FIELD_TYPE_LOCATION,
  FIELD_TYPE_NUMBER,
  FORMATS_UTM,
  FORMATS_DEC_DEG,
  FORMATS_DEG_MIN_SEC,
  FIELD_TYPE_IMAGE,
  FIELD_TYPE_VIDEO,
  FIELD_TYPE_MEDIA,
  FIELD_TYPE_AUDIO,
  FIELD_TYPE_LINK
} from '../../constants'

const FormattedValue = ({value, type, coordFormat = FORMATS_DEG_MIN_SEC}) => {
  switch (type) {
    case FIELD_TYPE_DATE:
      return <FormattedDate
        value={parseDate(value)}
        year='numeric'
        month='long'
        day='2-digit' />
    case FIELD_TYPE_LOCATION:
      return <span>{formatLocation(value, coordFormat)}</span>
    case FIELD_TYPE_NUMBER:
      return <span>{(value || 0) + ''}</span>
    case FIELD_TYPE_IMAGE:
    case FIELD_TYPE_VIDEO:
    case FIELD_TYPE_MEDIA:
    case FIELD_TYPE_AUDIO:
    case FIELD_TYPE_LINK:
      return <a href={value} target='_blank'>{value}</a>
    default:
      return <FormattedMessage {...msg('field_value')(value)} />
  }
}

export default FormattedValue

function formatLocation (coords, format) {
  if (!(Array.isArray(coords) && coords.length === 2)) return coords
  switch (format) {
    case FORMATS_DEC_DEG:
      return coords.map(coord => roundTo(coord, 5)).join(', ')
    case FORMATS_DEG_MIN_SEC:
      return sexagesimal.formatPair({lon: coords[0], lat: coords[1]}).replace(/'/g, '’').replace(/"/g, '”')
    case FORMATS_UTM:
      const utm = fromLatLon(coords[1], coords[0])
      return `X ${roundTo(utm.easting, 1)}, Y ${roundTo(utm.northing, 1)} — UTM ${utm.zoneNum}${utm.zoneLetter}`
  }
}
