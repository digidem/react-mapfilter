import React from 'react'
import Image from './image'
import assign from 'object-assign'
import {FormattedMessage} from 'react-intl'

import {createMessage as msg} from '../util/intl_helpers'

const styles = {
  wrapper: {
    width: 200,
    height: 200,
    padding: 0,
    backgroundColor: 'black',
    cursor: 'pointer',
    pointerEvents: 'none',
    position: 'absolute',
    willChange: 'transform',
    top: 0,
    left: 0
  },
  image: {
    width: 200,
    height: 200,
    objectFit: 'cover',
    display: 'block',
    background: '#000000'
  },
  title: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white'
  },
  h1: {
    margin: '10px 10px 5px 10px'
  },
  h2: {
    margin: '5px 10px',
    fontStyle: 'normal',
    fontSize: '14px'
  }
}

class Popup extends React.Component {
  static defaultProps = {
    offset: {
      x: 0,
      y: -12
    }
  }
  constructor (props) {
    super(props)
    this.map = props.map
  }

  state = {}

  update = (lngLat) => {
    if (!Array.isArray(lngLat) || lngLat.length !== 2) lngLat = this.props.lngLat
    const w = this._el.offsetWidth
    const h = this._el.offsetHeight
    this.setState({
      transform: getPopupTransform(this.map, lngLat, w, h, this.props.offset)
    })
  }

  componentDidMount () {
    const {lngLat} = this.props
    this.map.on('move', this.update)
    this.update(lngLat)
  }

  componentWillReceiveProps ({lngLat}) {
    this.update(lngLat)
  }

  componentWillUnmount () {
    this.map.off('move', this.update)
  }

  render () {
    const {media, title, subtitle} = this.props
    const {transform} = this.state

    return <div style={assign({}, styles.wrapper, {transform})} ref={el => (this._el = el)}>
      {media && <Image src={media} style={styles.image} />}
      <div style={styles.title}>
        <h1 style={styles.h1}>
          <FormattedMessage {...msg('field_value')(title)} />
        </h1>
        <h2 style={assign({}, styles.h1, styles.h2)}>
          <FormattedMessage {...msg('field_value')(subtitle)} />
        </h2>
      </div>
    </div>
  }
}

function getPopupTransform (map, lngLat, width, height, offset = {x: 0, y: 0}) {
  const pos = map.project(lngLat).round()
  let anchor

  if (pos.y < height) {
    anchor = 'top'
  } else {
    anchor = 'bottom'
  }

  if (pos.x > map.transform.width - width) {
    anchor += '-right'
  } else {
    anchor += '-left'
  }

  const anchorTranslate = {
    'top-left': 'translate(0,0)',
    'top-right': 'translate(-100%,0)',
    'bottom-left': 'translate(0,-100%)',
    'bottom-right': 'translate(-100%,-100%)'
  }

  return `${anchorTranslate[anchor]} translate(${pos.x + offset.x}px,${pos.y + offset.y}px)`
}

export default Popup
