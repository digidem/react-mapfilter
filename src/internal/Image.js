// @flow
import React from 'react'
import Img from 'react-image'
import CircularProgress from '@material-ui/core/CircularProgress'
import BrokenImageIcon from '@material-ui/icons/BrokenImage'
// import * as CSS from 'csstype'
import { withStyles } from '@material-ui/styles'

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

const ImageLoader = withStyles(styles)(({ classes, style }) => {
  return (
    <div className={classes.wrapper} style={{ ...style, color: 'white' }}>
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

const Image = ({ style, src, className }: Props) => {
  return (
    <Img
      src={src}
      style={{ objectFit: 'contain', display: 'block', ...style }}
      className={className}
      loader={<ImageLoader style={style} />}
      unloader={<BrokenImage style={style} />}
    />
  )
}

export default Image
