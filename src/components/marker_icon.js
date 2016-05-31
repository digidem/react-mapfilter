const React = require('react')

const styles = {
  svg: {
    width: 24,
    height: 24,
    margin: 8
  },
  outline: {
    stroke: '#ffffff',
    strokeWidth: 4.9,
    strokeMiterlimit: 4,
    strokeOpacity: 0.75,
    fill: 'none'
  }
}

const MarkerIcon = ({style = {}, color = '#000000'}) => {
  return (
    <svg
      version='1.1'
      style={{...styles.svg, ...style}}
      viewBox='0 0 17 23'>
      <path
        style={styles.outline}
        d='m 14.553146,8.5640275 c 0,3.5432455 -4.272809,9.2124385 -6.0531456,10.9840595 C 6.7196625,17.776466 2.4468536,12.107273 2.4468536,8.5640275 c 0,-2.8345967 2.8485396,-6.0235176 6.0531468,-6.0235176 3.2046076,0 6.0531456,3.1889209 6.0531456,6.0235176 z'
      />
      <path
        style={{fill: color}}
        d='m 14.553146,8.5640275 c 0,3.5432455 -4.272809,9.2124385 -6.0531456,10.9840595 C 6.7196625,17.776466 2.4468536,12.107273 2.4468536,8.5640275 c 0,-2.8345967 2.8485396,-6.0235176 6.0531468,-6.0235176 3.2046076,0 6.0531456,3.1889209 6.0531456,6.0235176 z'
      />
    </svg>
  )
}

module.exports = MarkerIcon
