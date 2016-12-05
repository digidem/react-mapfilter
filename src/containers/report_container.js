const React = require('react')
const { connect } = require('react-redux')
const { PropTypes } = React;

const FeatureModal = require('../components/feature_modal')
const MFPropTypes = require('../util/prop_types')
const MapView = require('../components/map_view')
const getMapGeoJSON = require('../selectors/map_geojson')
const getMapBoxFilter = require('../selectors/mapbox_filter')
const getFieldMapping = require('../selectors/field_mapping')

class ReportContainer extends React.Component {
  static propTypes = {
    geojson: PropTypes.shape({
      type: PropTypes.oneOf(['FeatureCollection']).isRequired,
      features: PropTypes.arrayOf(MFPropTypes.mapViewFeature).isRequired
    }),
    fieldMapping: MFPropTypes.fieldMapping,
    filter: MFPropTypes.mapboxFilter,
  }

  render () {
    return (
      <div style={{ display: 'flex', flexGrow: 1, flexWrap: 'wrap', overflow: 'scroll' }}>
        <MapView
          style={{ height: '500px', width: '100%' }}
          disableScrollToZoom={true}
          {...this.props}
        />
        {
          this.props.geojson.features.map((feature, id) => (
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
    filter: getMapBoxFilter(state),
    fieldMapping: getFieldMapping(state)
  }
}

module.exports = connect(
  mapStateToProps
)(ReportContainer)
