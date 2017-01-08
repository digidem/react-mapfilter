const { connect } = require('react-redux')

const MapView = require('../components/map_view')
const { moveMap } = require('../action_creators')
const getMapGeoJSON = require('../selectors/map_geojson')
const getMapBoxFilter = require('../selectors/mapbox_filter')
const getFieldMapping = require('../selectors/field_mapping')

function mapStateToProps (state) {
  return {
    center: state.mapPosition.center,
    zoom: state.mapPosition.zoom,
    geojson: getMapGeoJSON(state),
    filter: getMapBoxFilter(state),
    fieldMapping: getFieldMapping(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onMove: mapPosition => dispatch(moveMap(mapPosition))
  }
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(MapView)
