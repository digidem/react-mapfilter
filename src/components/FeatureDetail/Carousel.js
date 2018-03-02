import React, {Children} from 'react'
import PropTypes from 'prop-types'
import assign from 'object-assign'

const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative'
  },
  frame: {
    top: 0,
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
}

let wrapper
let frames = {}

class Carousel extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      current: 0
    }
    this.mounted = false
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.autoSlide = this.autoSlide.bind(this)
    this.prev = this.prev.bind(this)
    this.next = this.next.bind(this)

    if (props.loop === false && props.auto) {
      console.warn('[re-carousel] Auto-slide only works in loop mode.')
    }
  }

  componentDidMount () {
    this.mounted = true
    this.prepareAutoSlide()
    const childCount = Children.count(this.props.children)

    // Hide all frames
    for (let i = 1; i < childCount; i++) {
      frames['f' + i].style.opacity = 0
    }
  }

  componentWillUnmount () {
    this.mounted = false
    this.clearAutoTimeout()
  }

  onTouchStart (e) {
    const childCount = Children.count(this.props.children)
    if (childCount < 2) return

    this.clearAutoTimeout()
    this.updateFrameSize()
    this.prepareSiblingFrames()

    const { pageX, pageY } = (e.touches && e.touches[0]) || e
    this.setState({
      startX: pageX,
      startY: pageY,
      deltaX: 0,
      deltaY: 0
    })

    wrapper.addEventListener('touchmove', this.onTouchMove, {passive: true})
    wrapper.addEventListener('mousemove', this.onTouchMove, {passive: true})
    wrapper.addEventListener('touchend', this.onTouchEnd, true)
    wrapper.addEventListener('mouseup', this.onTouchEnd, true)
  }

  onTouchMove (e) {
    if (e.touches && e.touches.length > 1) return

    this.clearAutoTimeout()

    const { pageX, pageY } = (e.touches && e.touches[0]) || e
    let deltaX = pageX - this.state.startX
    let deltaY = pageY - this.state.startY
    this.setState({
      deltaX: deltaX,
      deltaY: deltaY
    })

    const childCount = Children.count(this.props.children)

    // when reach frames edge in non-loop mode, reduce drag effect.
    if (!this.props.loop) {
      if (this.state.current === childCount - 1) {
        deltaX < 0 && (deltaX /= 3)
        deltaY < 0 && (deltaY /= 3)
      }
      if (this.state.current === 0) {
        deltaX > 0 && (deltaX /= 3)
        deltaY > 0 && (deltaY /= 3)
      }
    }

    this.moveFramesBy(deltaX, deltaY)
  }

  onTouchEnd () {
    const direction = this.decideEndPosition()
    direction && this.transitFramesTowards(direction)

    // cleanup
    wrapper.removeEventListener('touchmove', this.onTouchMove)
    wrapper.removeEventListener('mousemove', this.onTouchMove)
    wrapper.removeEventListener('touchend', this.onTouchEnd, true)
    wrapper.removeEventListener('mouseup', this.onTouchEnd, true)

    setTimeout(() => this.prepareAutoSlide(), this.props.duration)
  }

  decideEndPosition () {
    const { deltaX = 0, deltaY = 0, current } = this.state
    const { axis, loop, minMove, children } = this.props
    const childLength = Children.count(children)

    switch (axis) {
      case 'x':
        if (loop === false) {
          if (current === 0 && deltaX > 0) return 'origin'
          if (current === childLength - 1 && deltaX < 0) return 'origin'
        }
        if (Math.abs(deltaX) < minMove) return 'origin'
        return deltaX > 0 ? 'right' : 'left'
      case 'y':
        if (loop === false) {
          if (current === 0 && deltaY > 0) return 'origin'
          if (current === childLength - 1 && deltaY < 0) return 'origin'
        }
        if (Math.abs(deltaY) < minMove) return 'origin'
        return deltaY > 0 ? 'down' : 'up'
      default:
    }
  }

  moveFramesBy (deltaX, deltaY) {
    const { prev, current, next } = this.state.movingFrames
    const { frameWidth, frameHeight } = this.state

    switch (this.props.axis) {
      case 'x':
        translateXY(current, deltaX, 0)
        if (deltaX < 0) {
          translateXY(next, deltaX + frameWidth, 0)
        } else {
          translateXY(prev, deltaX - frameWidth, 0)
        }
        break
      case 'y':
        translateXY(current, 0, deltaY)
        if (deltaY < 0) {
          translateXY(next, 0, deltaY + frameHeight)
        } else {
          translateXY(prev, 0, deltaY - frameHeight)
        }
        break
      default:
    }
  }

  prepareAutoSlide () {
    if (Children.count(this.props.children) < 2) return

    this.clearAutoTimeout()
    this.updateFrameSize(() => {
      this.prepareSiblingFrames()
    })

    // auto slide only avalible in loop mode
    if (this.mounted && this.props.loop && this.props.auto) {
      const slideTimeoutID = setTimeout(this.autoSlide, this.props.interval)
      this.setState({ slider: slideTimeoutID })
    }
  }

  // auto slide to 'next' or 'prev'
  autoSlide (rel) {
    this.clearAutoTimeout()

    switch (rel) {
      case 'prev':
        this.transitFramesTowards(this.props.axis === 'x' ? 'right' : 'down')
        break
      case 'next':
      default:
        this.transitFramesTowards(this.props.axis === 'x' ? 'left' : 'up')
    }

    // prepare next move after animation
    setTimeout(() => this.prepareAutoSlide(), this.props.duration)
  }

  next () {
    const { current } = this.state
    const childCount = Children.count(this.props.children)
    if (!this.props.loop && current === childCount - 1) return false
    this.autoSlide('next')
  }

  prev () {
    if (!this.props.loop && this.state.current === 0) return false
    this.autoSlide('prev')
  }

  clearAutoTimeout () {
    clearTimeout(this.state.slider)
  }

  updateFrameSize (cb) {
    const { width, height } = window.getComputedStyle(wrapper)
    this.setState({
      frameWidth: parseFloat(width.split('px')[0]),
      frameHeight: parseFloat(height.split('px')[0])
    }, cb)
  }

  prepareSiblingFrames () {
    const siblings = {
      current: frames['f' + this.getFrameId()],
      prev: frames['f' + this.getFrameId('prev')],
      next: frames['f' + this.getFrameId('next')]
    }

    if (!this.props.loop) {
      this.state.current === 0 && (siblings.prev = undefined)
      this.state.current === Children.count(this.props.children) - 1 && (siblings.next = undefined)
    }

    this.setState({ movingFrames: siblings })

    // prepare frames position
    translateXY(siblings.current, 0, 0)
    if (this.props.axis === 'x') {
      translateXY(siblings.prev, -this.state.frameWidth, 0)
      translateXY(siblings.next, this.state.frameWidth, 0)
    } else {
      translateXY(siblings.prev, 0, -this.state.frameHeight)
      translateXY(siblings.next, 0, this.state.frameHeight)
    }

    return siblings
  }

  getFrameId (pos) {
    const { children } = this.props
    const { current } = this.state
    const total = Children.count(children)
    switch (pos) {
      case 'prev':
        return (current - 1 + total) % total
      case 'next':
        return (current + 1) % total
      default:
        return current
    }
  }

  transitFramesTowards (direction) {
    const { prev, current, next } = this.state.movingFrames
    const { duration, axis } = this.props

    let newCurrentId = this.state.current
    switch (direction) {
      case 'up':
        translateXY(current, 0, -this.state.frameHeight, duration)
        translateXY(next, 0, 0, duration)
        newCurrentId = this.getFrameId('next')
        break
      case 'down':
        translateXY(current, 0, this.state.frameHeight, duration)
        translateXY(prev, 0, 0, duration)
        newCurrentId = this.getFrameId('prev')
        break
      case 'left':
        translateXY(current, -this.state.frameWidth, 0, duration)
        translateXY(next, 0, 0, duration)
        newCurrentId = this.getFrameId('next')
        break
      case 'right':
        translateXY(current, this.state.frameWidth, 0, duration)
        translateXY(prev, 0, 0, duration)
        newCurrentId = this.getFrameId('prev')
        break
      default: // back to origin
        translateXY(current, 0, 0, duration)
        if (axis === 'x') {
          translateXY(prev, -this.state.frameWidth, 0, duration)
          translateXY(next, this.state.frameWidth, 0, duration)
        } else if (axis === 'y') {
          translateXY(prev, 0, -this.state.frameHeight, duration)
          translateXY(next, 0, this.state.frameHeight, duration)
        }
    }

    this.setState({ current: newCurrentId })
  }

  // debugFrames () {
  //   console.log('>>> DEBUG-FRAMES: current', this.state.current)
  //   const len = this.state.frames.length
  //   for (let i = 0; i < len; ++i) {
  //     const ref = this.refs['f' + i]
  //     console.info(ref.innerText.trim(), ref.style.transform)
  //   }
  // }

  render () {
    const { current } = this.state
    const { children, widgets, axis, loop, auto, interval, className } = this.props

    return (
      <div
        ref={_wrapper => { wrapper = _wrapper }}
        className={className}
        style={assign({}, styles.wrapper, this.props.style)}
        onTouchStart={this.onTouchStart}
        onMouseDown={this.onTouchStart} >
        {
          Children.map(children, (child, i) => {
            const frameStyle = assign({zIndex: 99 - i}, styles.frame)
            return <div ref={_f => { frames['f' + i] = _f }} key={i} style={frameStyle}>{child}</div>
          })
        }
        {
          widgets && [].concat(widgets).map((Widget, i) => (
            <Widget
              key={i}
              index={current}
              total={Children.count(children)}
              prevHandler={this.prev}
              nextHandler={this.next}
              axis={axis} loop={loop} auto={auto} interval={interval} />
          ))
        }
      </div>
    )
  }
}

Carousel.propTypes = {
  axis: PropTypes.oneOf(['x', 'y']),
  auto: PropTypes.bool,
  loop: PropTypes.bool,
  interval: PropTypes.number,
  duration: PropTypes.number,
  widgets: PropTypes.arrayOf(PropTypes.func),
  style: PropTypes.object,
  minMove: PropTypes.number
}

Carousel.defaultProps = {
  axis: 'x',
  auto: false,
  loop: false,
  interval: 5000,
  duration: 300,
  minMove: 42
}

function translateXY (el, x, y, duration = 0) {
  if (!el) return

  el.style.opacity = '1'

  // animation
  el.style.transitionDuration = duration + 'ms'
  el.style.webkitTransitionDuration = duration + 'ms'

  el.style.transfrom = `translate(${x}px, ${y}px)`
  el.style.webkitTransform = `translate(${x}px, ${y}px) translateZ(0)`
}

export default Carousel
