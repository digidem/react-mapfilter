// @flow
import React from 'react'
import assign from 'object-assign'

const styles = {
  svg: {
    width: 32,
    height: 32
  },
  outline: {
    stroke: '#ffffff',
    strokeWidth: 4.9,
    strokeMiterlimit: 4,
    strokeOpacity: 0.75,
    fill: 'none'
  },
  text: {
    fill: '#fff'
  }
}

const MarkerIcon = ({ style = {}, color = '#000000', label }) => {
  return (
    <svg
      version="1.1"
      style={assign({}, styles.svg, style)}
      viewBox="0 0 40 40">
      <circle
        style={assign({}, styles.outline, { fill: color })}
        r="20"
        cx="20"
        cy="20"
      />
      {label && (
        <text
          x="20"
          y="27"
          fontSize="20"
          fontFamily="Roboto"
          textAnchor="middle"
          style={styles.text}>
          {label}
        </text>
      )}
    </svg>
  )
}

export default MarkerIcon
