const React = require('react')
const { connect } = require('react-redux')
const { PropTypes } = React

const FeatureModal = require('../components/feature_modal')
const MFPropTypes = require('../util/prop_types')
const MapView = require('../components/map_view')
const getFieldMapping = require('../selectors/field_mapping')
const getFilteredFeatures = require('../selectors/filtered_features')
const getMapGeoJSON = require('../selectors/map_geojson')
const getMapBoxFilter = require('../selectors/mapbox_filter')

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
    const { features, fieldMapping, filter, geojson } = this.props

    return (
      <div className='report container' style={{ display: 'flex', flexGrow: 1, flexWrap: 'wrap', overflow: 'scroll' }}>
        <h2>{ features.length } Observations</h2>
        <MapView
          fieldMapping={fieldMapping}
          filter={filter}
          geojson={geojson}
          style={{ height: '500px', width: '100%' }}
          disableScrollToZoom
        />
        {
          features.map((feature, id) => (
            <FeatureModal
              key={id}
              id={feature.properties.id}
            />
          ))
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    geojson: getMapGeoJSON(state),
    features: getFilteredFeatures(state),
    filter: getMapBoxFilter(state),
    fieldMapping: getFieldMapping(state)
  }
}

module.exports = connect(
  mapStateToProps
)(ReportContainer)
