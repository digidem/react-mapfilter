import React from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'

import Image from '../Image'
import FormattedValue from '../Shared/FormattedValue'
import getFeaturesById from '../../selectors/features_by_id'
import getFieldMapping from '../../selectors/field_mapping'
import getColorIndex from '../../selectors/color_index'
import getFieldAnalysis from '../../selectors/field_analysis'

const styles = {
  wrapper: {
    width: 200,
    padding: 0,
    backgroundColor: 'black',
    cursor: 'pointer',
    position: 'absolute',
    willChange: 'transform',
    top: 0,
    left: 0,
    pointerEvents: 'none'
  },
  wrapperImage: {
    height: 200
  },
  image: {
    width: 200,
    height: 200,
    objectFit: 'cover',
    display: 'block',
    background: '#000000'
  },
  titleBox: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    padding: '0.25em 0.5em',
    boxSizing: 'border-box'
  },
  title: {
    color: 'white'
  },
  subheading: {
    color: 'white'
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
    const {media, title, subtitle, classes, titleType, subtitleType} = this.props
    const {transform} = this.state

    return <div className={classNames(classes.wrapper, {[classes.wrapperImage]: media})} style={{transform}} ref={el => (this._el = el)}>
      {media && <Image src={media} className={classes.image} />}
      <div className={classes.titleBox}>
        {title && <Typography type='title' className={classes.title}>
          <FormattedValue value={title} type={titleType} />
        </Typography>}
        {subtitle && <Typography type='subheading' className={classes.subheading}>
          <FormattedValue value={subtitle} type={subtitleType} />
        </Typography>}
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

const mapStateToProps = (state, ownProps) => {
  const featuresById = getFeaturesById(state)
  const colorIndex = getColorIndex(state)
  const fieldMapping = getFieldMapping(state)
  const feature = featuresById[ownProps.id]
  if (!feature) return {}
  const geojsonProps = feature.properties
  const fieldAnalysisProps = getFieldAnalysis(state).properties
  return {
    media: geojsonProps[fieldMapping.media],
    title: geojsonProps[fieldMapping.title],
    subtitle: geojsonProps[fieldMapping.subtitle],
    color: colorIndex[geojsonProps[fieldMapping.color]],
    titleType: fieldAnalysisProps[fieldMapping.title] && fieldAnalysisProps[fieldMapping.title].type,
    subtitleType: fieldAnalysisProps[fieldMapping.subtitle] && fieldAnalysisProps[fieldMapping.subtitle].type
  }
}

export default compose(
  connect(mapStateToProps),
  withStyles(styles)
)(Popup)
