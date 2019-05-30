import roundTo from 'round-to'
import {fromLatLon} from 'utm'
import sexagesimal from '@mapbox/sexagesimal'
import {
  FORMATS_UTM,
  FORMATS_DEC_DEG,
  FORMATS_DEG_MIN_SEC
} from '../constants'

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

export default formatLocation
