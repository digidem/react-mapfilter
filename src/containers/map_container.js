import { connect } from 'react-redux'

import MapView from '../components/map_view'
import { moveMap, showFeatureDetail } from '../action_creators'
import getMapGeoJSON from '../selectors/map_geojson'
import getMapBoxFilter from '../selectors/mapbox_filter'
import getFieldMapping from '../selectors/field_mapping'

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
    onMove: mapPosition => dispatch(moveMap(mapPosition)),
    onMarkerClick: id => dispatch(showFeatureDetail(id))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapView)
