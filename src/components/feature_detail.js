import React from 'react'

import { connect } from 'react-redux'
import { Card, CardMedia, CardText, CardHeader } from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import {FormattedMessage} from 'react-intl'

import getFeaturesById from '../selectors/features_by_id'
import getFieldMapping from '../selectors/field_mapping'
import getColorIndex from '../selectors/color_index'
import getVisibleFields from '../selectors/visible_fields'
import getFieldAnalysis from '../selectors/field_analysis'
import {createMessage as msg} from '../util/intl_helpers'
import MarkerIcon from './marker_icon'
import Image from './image'
import FeatureTable from './feature_table'

const styles = {
  card: {
    overflow: 'auto',
    width: '100%'
  },
  cardUnrestricted: {
    width: '100%'
  },
  header: {
    lineHeight: '22px',
    boxSizing: 'content-box',
    borderBottom: '1px solid #cccccc'
  },
  markerIcon: {
    width: 40,
    height: 40,
    margin: 0,
    marginRight: 16
  },
  media: {
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
    objectFit: 'cover'
  }
}

const FeatureDetail = ({color, label, media, data, title, subtitle, onCloseClick, print}) => (
  <Card
    className='card'
    style={styles.card}
    zDepth={0}>
    <CardHeader
      style={styles.header}
      avatar={<MarkerIcon color={color} style={styles.markerIcon} label={label} />}
      title={<FormattedMessage {...msg('field_value')(title)} />}
      subtitle={<FormattedMessage {...msg('field_value')(subtitle)} />}>
      { onCloseClick &&
        <IconButton style={{float: 'right'}} onTouchTap={onCloseClick}>
          <CloseIcon />
        </IconButton>
      }
    </CardHeader>
    <div>
      {
        media &&
          <CardMedia style={styles.media}>
            <Image style={styles.img} src={media} />
          </CardMedia>
      }
      <CardText>
        <FeatureTable data={data} print={print} />
      </CardText>
    </div>
  </Card>
)

export default connect(
  (state, ownProps) => {
    const featuresById = getFeaturesById(state)
    const colorIndex = getColorIndex(state)
    const fieldMapping = getFieldMapping(state)
    const visibleFields = getVisibleFields(state)
    const fieldAnalysis = getFieldAnalysis(state)
    const id = ownProps.id || state.ui.featureId
    const feature = featuresById[id]
    if (!feature) return {}
    const geojsonProps = feature.properties
    const data = visibleFields
      .filter(f => typeof geojsonProps[f] !== 'undefined')
      .map(f => ({key: f, value: geojsonProps[f], type: fieldAnalysis.properties[f].type}))
    if (feature.geometry) {
      data.unshift({
        key: 'location',
        value: feature.geometry.coordinates
      })
    }
    return {
      data: data,
      media: geojsonProps[fieldMapping.media],
      title: geojsonProps[fieldMapping.title],
      subtitle: geojsonProps[fieldMapping.subtitle],
      color: colorIndex[geojsonProps[fieldMapping.color]]
    }
  }
)(FeatureDetail)
