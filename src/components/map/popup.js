import React from 'react'
import assign from 'object-assign'
import {FormattedMessage} from 'react-intl'
import {connect} from 'react-redux'
import {darken, fade} from 'material-ui/utils/colorManipulator'

import Image from '../../components/image'
import getFeaturesById from '../../selectors/features_by_id'
import getFieldMapping from '../../selectors/field_mapping'
import getColorIndex from '../../selectors/color_index'
import {createMessage as msg} from '../../util/intl_helpers'

const styles = {
  wrapper: {
    width: 200,
    height: 200,
    padding: 0,
    backgroundColor: 'black',
    cursor: 'pointer',
    position: 'absolute',
    willChange: 'transform',
    top: 0,
    left: 0,
    pointerEvents: 'none'
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
    margin: '6px 8px 0',
    fontSize: '1.4em'
  },
  h2: {
    margin: '0 8px 5px',
    fontStyle: 'normal',
    fontSize: '1em'
  }
}

class Popup extends React.Component {
  static defaultProps = {
    offset: {
      x: 0,
      y: 0
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
    const {media, title, subtitle, color} = this.props
    const {transform} = this.state

    return <div style={assign({}, styles.wrapper, {transform})} ref={el => (this._el = el)}>
      {media && <Image src={media} style={styles.image} />}
      <div style={assign({}, styles.title, {
        backgroundColor: fade(darken(color || '#000', 0.5), 0.5)
      })}>
        {title && <h1 style={styles.h1}>
          <FormattedMessage {...msg('field_value')(title)} />
        </h1>}
        {subtitle && <h2 style={assign({}, styles.h1, styles.h2)}>
          <FormattedMessage {...msg('field_value')(subtitle)} />
        </h2>}
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

export default connect(
  (state, ownProps) => {
    const featuresById = getFeaturesById(state)
    const colorIndex = getColorIndex(state)
    const fieldMapping = getFieldMapping(state)
    const feature = featuresById[ownProps.id]
    if (!feature) return {}
    const geojsonProps = feature.properties

    return {
      media: geojsonProps[fieldMapping.media],
      title: geojsonProps[fieldMapping.title],
      subtitle: geojsonProps[fieldMapping.subtitle],
      color: colorIndex[geojsonProps[fieldMapping.color]]
    }
  }
)(Popup)
