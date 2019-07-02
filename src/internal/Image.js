// @flow
import React, { useContext } from 'react'
import Img from 'react-image'
import CircularProgress from '@material-ui/core/CircularProgress'
import BrokenImageIcon from '@material-ui/icons/BrokenImage'
// import * as CSS from 'csstype'
import AutoSizer from 'react-virtualized-auto-sizer'
import { withStyles } from '@material-ui/styles'

import { ResizerContext } from './Context'

const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    position: 'relative',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }
}

const pixelRatio = window.devicePixelRatio || 1

const ImageLoader = withStyles(styles)(({ classes, preview, style }) => {
  return (
    <div
      className={classes.wrapper}
      style={{ ...style, backgroundImage: `url(${preview})`, color: 'white' }}>
      <CircularProgress color="inherit" />
    </div>
  )
})

const BrokenImage = withStyles(styles)(({ classes, style }) => (
  <div className={classes.wrapper} style={style}>
    <BrokenImageIcon color="white" />
  </div>
))

type Props = {
  style?: { [prop: string]: string | number },
  src: string,
  className?: string
}

type Dimensions = {
  width: number,
  height: number
}

const ImageMeasured = ({
  style,
  src,
  className,
  width,
  height
}: Props & Dimensions) => {
  const resizer = useContext(ResizerContext)
  // Show a preview image, but only if the size difference is worth it
  const preview =
    Math.max(width, height) > 300 && resizer(src, 100 * pixelRatio)
  // Get a url to the resized src
  src = resizer(src, pixelRatio * roundUp(Math.max(width, height)))
  return (
    <Img
      src={src}
      style={{ objectFit: 'contain', display: 'block', ...style }}
      className={className}
      loader={<ImageLoader preview={preview} style={style} />}
      unloader={<BrokenImage style={style} />}
    />
  )
}

// Inject width & height props. If the style has width & height, use them,
// if not, measure the DOM after render with AutoSizer
const Image = (props: Props) => {
  const { style } = props
  if (
    style &&
    typeof style.width === 'number' &&
    typeof style.height === 'number'
  ) {
    return (
      <ImageMeasured {...props} width={style.width} height={style.height} />
    )
  }
  return (
    <AutoSizer style={{ width: '100%', height: '100%' }}>
      {({ width, height }) => (
        <ImageMeasured {...props} width={width} height={height} />
      )}
    </AutoSizer>
  )
}

export default Image

function roundUp(v) {
  return Math.ceil(v / 50) * 50
}
