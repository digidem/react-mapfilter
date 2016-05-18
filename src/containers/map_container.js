const { connect } = require('react-redux')
const { push } = require('react-router-redux')
const get = require('get-value')

const MapView = require('../components/map_view')
const { moveMap } = require('../action_creators')
const { memoize } = require('../util/util')

const COLORS = require('../../config.json').colors
const DEFAULT_COLOR = '#555555'

// Essentially: if the arguments are the same as last time,
// just return a cached result instead of re-mapping the features
const memoizedMapFeaturesToGeoJSON = memoize(mapFeaturesToGeoJSON)

/**
 * @private
 * `mapbox-gl` expects a GeoJSON FeatureCollection, which is converted
 * to vector tiles, which does not preserve Object or Array properties,
 * so we need to flatten the GeoJSON properties and we ensure each
 * feature has an `id` and the configured fields for the popup and marker
 * color
 * @param {array} features     An array of valid GeoJSON feature objects
 * @param {string} coloredField The fieldname of the property to color markers by
 * @param {object} popupFields  A mapping of `img`, `title`, `subtitle` to the properties to use
 * @return {object} GeoJSON FeatureCollection
 */
function mapFeaturesToGeoJSON (features, coloredField, popupFields) {
  const colorMapping = {}
  let colorIndex = 0
  return {
    type: 'FeatureCollection',
    features: features.map(feature => {
      const props = feature.properties
      let color
      let coloredFieldValue = get(props, coloredField)
      if (!coloredFieldValue) {
        color = DEFAULT_COLOR
      } else if (colorMapping[coloredFieldValue]) {
        color = colorMapping[coloredFieldValue]
      } else {
        color = colorMapping[coloredFieldValue] = COLORS[colorIndex] || DEFAULT_COLOR
        colorIndex++
      }
      const newProps = Object.assign({}, props, {
        __mf_id: feature.id,
        __mf_color: color.slice(1),
        __mf_popup_title: get(props, popupFields.title),
        __mf_popup_subtitle: get(props, popupFields.subtitle),
        __mf_popup_img: get(props, popupFields.img)
      })
      const newFeature = Object.assign({}, feature, {
        properties: newProps
      })
      return newFeature
    })
  }
}

function mapStateToProps ({
  mapPosition,
  features,
  coloredField,
  popupFields,
  filter
}) {
  const geojson = memoizedMapFeaturesToGeoJSON(
    features,
    coloredField,
    popupFields
  )
  return {
    center: mapPosition.center,
    zoom: mapPosition.zoom,
    geojson: geojson,
    filter: filter
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onMove: (mapPosition) => dispatch(moveMap(mapPosition)),
    onMarkerClick: (id) => dispatch(push('/features/' + id))
  }
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(MapView)
