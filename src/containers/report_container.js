const React = require('react')
const { connect } = require('react-redux')
const { PropTypes } = React

const FeatureModal = require('../components/feature_modal')
const MFPropTypes = require('../util/prop_types')
const MapView = require('../components/map_view')
const getFieldMapping = require('../selectors/field_mapping')
const getFilteredFeatures = require('../selectors/filtered_features')
const getMapboxFilter = require('../selectors/mapbox_filter')
const getMapGeoJSON = require('../selectors/map_geojson')

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
            <FeatureModal
              key={id}
              id={feature.id}
              label={feature.properties.__mf_label}
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

module.exports = connect(
  mapStateToProps
)(ReportContainer)
