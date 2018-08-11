// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import classNames from 'classnames'
import Carousel from 're-carousel'

import Image from '../Image'

const styles = {
  root: {
    position: 'relative',
    height: '100%',
    padding: '67% 0 0 0'
  },
  img: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
    objectFit: 'cover',
    transform: 'translate3d(0,0,0)'
  },
  widget: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    display: 'flex'
  },
  nextPrevWidget: {
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dotsWidget: {
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  button: {
    color: 'white',
    zIndex: 400
  },
  dot: {
    zIndex: 400,
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    margin: '10px 4px'
  },
  dotHighlight: {
    backgroundColor: 'rgba(255,255,255,1)'
  }
}

const NextPrevButtons = ({
  index,
  total,
  prevHandler,
  nextHandler,
  classes,
  loop
}) => {
  if (total < 2) return null
  const showNext = total > 1 && (!!loop || index < total - 1)
  const showPrev = total > 1 && (!!loop || index > 0)
  return (
    <div className={classNames(classes.widget, classes.nextPrevWidget)}>
      <div>
        {showPrev && (
          <IconButton onClick={prevHandler} className={classes.button}>
            <NavigateBeforeIcon />
          </IconButton>
        )}
      </div>
      <div>
        {showNext && (
          <IconButton onClick={nextHandler} className={classes.button}>
            <NavigateNextIcon />
          </IconButton>
        )}
      </div>
    </div>
  )
}

const Dots = ({ index, total, prevHandler, nextHandler, classes, loop }) =>
  total > 1 && (
    <div className={classNames(classes.widget, classes.dotsWidget)}>
      {Array(total)
        .fill()
        .map((_, i) => (
          <div
            key={i}
            className={classNames(classes.dot, {
              [classes.dotHighlight]: index === i
            })}
          />
        ))}
    </div>
  )

const withStylesNextPrevButtons = withStyles(styles)(NextPrevButtons)
const withStylesDots = withStyles(styles)(Dots)

const MediaCarousel = ({ media, classes }) => (
  <Carousel
    className={classes.root}
    widgets={[withStylesNextPrevButtons, withStylesDots]}
    duration={500}
    loop>
    {media.map((m, i) => (
      <Image key={i} className={classes.img} src={m.value} />
    ))}
  </Carousel>
)

MediaCarousel.propTypes = {
  media: PropTypes.array,
  classes: PropTypes.object.isRequired
}

MediaCarousel.defaultProps = {
  media: []
}

export default withStyles(styles)(MediaCarousel)
