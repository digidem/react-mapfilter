const React = require('react')
const { connect } = require('react-redux')
const history = require('../history')

const MapView = require('../components/map_view')
const { moveMap } = require('../action_creators')
const getMapGeoJSON = require('../selectors/map_geojson')
const getMapBoxFilter = require('../selectors/mapbox_filter')
const deepEqual = require('deep-equal')
const roundTo = require('round-to')

class MapContainer extends React.Component {
  handleMarkerClick = (id) => {
    const {location} = this.props
    history.push({
      ...location,
      pathname: '/map/features/' + id
    })
  }

  // Read the map position from the URL on first load
  componentWillMount () {
    const {center, zoom, location: {query}, onMove} = this.props
    // If `center` and `zoom` are not set, try to read from the URL query
    // parameter and update the application state.
    const isUrlValid = !isNaN(+query.lng) && !isNaN(+query.lat) && !isNaN(+query.z)
    if ((!center || !zoom) && isUrlValid) {
      onMove({
        zoom: +query.z,
        center: [+query.lng, +query.lat]
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    const {center, zoom, location} = this.props

    if (deepEqual(center, nextProps.center) && zoom === nextProps.zoom) return

    // If `mapPosition` has changed, update URL query string to new value
    history.replace({
      ...location,
      query: {
        ...nextProps.location.query,
        z: nextProps.zoom && roundTo(nextProps.zoom, 2),
        lng: nextProps.center && roundTo(nextProps.center[0], 4),
        lat: nextProps.center && roundTo(nextProps.center[1], 4)
      }
    })
  }

  render () {
    return <MapView {...this.props} onMarkerClick={this.handleMarkerClick} />
  }
}

function mapStateToProps (state) {
  return {
    center: state.mapPosition.center,
    zoom: state.mapPosition.zoom,
    geojson: getMapGeoJSON(state),
    filter: getMapBoxFilter(state),
    popupFields: state.popupFields
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
)(MapContainer)
