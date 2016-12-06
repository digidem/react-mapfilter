const assign = require('object-assign')
const React = require('react')
const { connect } = require('react-redux')
const { PropTypes } = React

const FeatureModal = require('../components/feature_modal')
const MFPropTypes = require('../util/prop_types')
const MapView = require('../components/map_view')
const getFieldMapping = require('../selectors/field_mapping')
const getFilteredFeatures = require('../selectors/filtered_features')
const getMapGeoJSON = require('../selectors/map_geojson')

const LABEL_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

class ReportContainer extends React.Component {
  static propTypes = {
    features: PropTypes.array.isRequired,
    fieldMapping: MFPropTypes.fieldMapping,
    geojson: PropTypes.shape({
      type: PropTypes.oneOf(['FeatureCollection']).isRequired,
      features: PropTypes.arrayOf(MFPropTypes.mapViewFeature).isRequired
    }).isRequired
  }

  render () {
    const { features, fieldMapping, geojson } = this.props

    return (
      <div className='report container' style={{ display: 'flex', flexGrow: 1, flexWrap: 'wrap', overflow: 'scroll' }}>
        <h2>{ features.length } Observations</h2>
        <MapView
          fieldMapping={fieldMapping}
          geojson={geojson}
          style={{ height: '500px', width: '100%' }}
          disableScrollToZoom
          labelPoints
        />
        {
          features.map((feature, id) => (
            <FeatureModal
              key={id}
              id={feature.properties.id}
              label={feature.properties.__mf_label}
            />
          ))
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  const features = getFilteredFeatures(state)

  // TODO if features have been filtered, all of the markers should be the same color
  // (this should already work, but fieldMapping.color is an unexpected value, e.g. 'area')
  if (features.length < LABEL_CHARS.length) {
    features.forEach((f, i) => {
      f.properties.__mf_label = LABEL_CHARS.charAt(i)
    })
  }

  const geojson = getMapGeoJSON(assign({}, state, {
    features
  }))

  return {
    geojson,
    features,
    fieldMapping: getFieldMapping(state)
  }
}

module.exports = connect(
  mapStateToProps
)(ReportContainer)
