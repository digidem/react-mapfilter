import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import FeatureDetail from '../components/feature_detail'
import * as MFPropTypes from '../util/prop_types'
import MapView from '../components/map_view'
import getFieldMapping from '../selectors/field_mapping'
import getFilteredFeatures from '../selectors/filtered_features'
import getMapboxFilter from '../selectors/mapbox_filter'
import getMapGeoJSON from '../selectors/map_geojson'

const styles = {
  report: {
    display: 'flex',
    flexGrow: 1,
    flexWrap: 'wrap',
    overflow: 'scroll'
  },
  mapView: {
    height: '500px',
    width: '100%'
  }
}

class ReportContainer extends React.Component {
  static propTypes = {
    features: PropTypes.array.isRequired,
    fieldMapping: MFPropTypes.fieldMapping,
    filter: MFPropTypes.mapboxFilter,
    geojson: PropTypes.shape({
      type: PropTypes.oneOf(['FeatureCollection']).isRequired,
      features: PropTypes.arrayOf(MFPropTypes.mapViewFeature).isRequired
    }).isRequired
  }

  render () {
    const { features } = this.props

    return (
      <div className='report container' style={styles.report}>
        <h2>{features.length} Observations</h2>
        <MapView
          {...this.props}
          style={styles.mapView}
          disableScrollToZoom
          labelPoints
        />
        {
          features.map((feature, id) => (
            <FeatureDetail
              key={id}
              id={feature.id}
              label={feature.properties.__mf_label}
              restrictHeight={false}
            />
          ))
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    features: getFilteredFeatures(state),
    fieldMapping: getFieldMapping(state),
    filter: getMapboxFilter(state),
    geojson: getMapGeoJSON(state)
  }
}

export default connect(
  mapStateToProps
)(ReportContainer)
