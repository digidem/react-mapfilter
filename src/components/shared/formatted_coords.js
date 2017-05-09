import React from 'react'
import PropTypes from 'prop-types'
import roundTo from 'round-to'
import {fromLatLon} from 'utm'

const FormattedCoords = ({value, format = 'lonlat'}) => {
  let location
  switch (format) {
    case 'lonlat':
      location = value.map(coord => roundTo(coord, 5)).join(', ')
      break
    case 'utm':
      const utm = fromLatLon(value[1], value[0])
      location = `X ${roundTo(utm.easting, 1)}, Y ${roundTo(utm.northing, 1)} — UTM ${utm.zoneNum}${utm.zoneLetter}`
      break
  }
  return <span>{location}</span>
}

FormattedCoords.propTypes = {
  value: PropTypes.array.isRequired,
  format: PropTypes.oneOf(['utm', 'lonlat'])
}

export default FormattedCoords
