// @flow
import { useContext } from 'react'
import sexagesimal from '@mapbox/sexagesimal'
import { fromLatLon } from 'utm'

import * as coordFormats from '../constants/coord_formats'
import { SettingsContext } from './Context'
import type { Coordinates } from '../types'

const FormattedLocation = ({ latitude, longitude }: Coordinates) => {
  const { coordFormat } = useContext(SettingsContext)
  switch (coordFormat) {
    case coordFormats.DEC_DEG:
      return formatDecDeg({ latitude, longitude })
    case coordFormats.DEG_MIN_SEC:
      return sexagesimal
        .formatPair({ lon: longitude, lat: latitude })
        .replace(/'/g, '’')
        .replace(/"/g, '”')
    case coordFormats.UTM:
      return formatUtm({ latitude, longitude })
  }
  return null
}

export default FormattedLocation

function formatUtm({ latitude, longitude }) {
  try {
    let { easting, northing, zoneNum, zoneLetter } = fromLatLon(
      latitude,
      longitude
    )
    easting = leftPad(easting.toFixed(), 6, '0')
    northing = leftPad(northing.toFixed(), 6, '0')
    return `UTM ${zoneNum}${zoneLetter} ${easting} ${northing}`
  } catch (e) {
    // Some coordinates (e.g. < 80S or 84N) cannot be formatted as UTM
    return formatDecDeg({ latitude, longitude })
  }
}

function formatDecDeg({ latitude, longitude }) {
  return `${latitude >= 0 ? '+' : ''}${latitude.toFixed(6)}°, ${
    longitude >= 0 ? '+' : ''
  }${longitude.toFixed(6)}°`
}

function leftPad(str: string, len: number, char: string): string {
  // doesn't need to pad
  len = len - str.length
  if (len <= 0) return str

  var pad = ''
  while (true) {
    if (len & 1) pad += char
    len >>= 1
    if (len) char += char
    else break
  }
  return pad + str
}
