const React = require('react')
const { connect } = require('react-redux')
const { bindActionCreators } = require('redux')
const deepEqual = require('deep-equal')
const roundTo = require('round-to')

const MapView = require('../components/map_view')
const Filter = require('../components/filter')
const actionCreators = require('../action_creators')
const history = require('../history')

const style = {
  width: '100vw',
  height: '100vh',
  position: 'relative'
}

class App extends React.Component {
  componentWillMount() {
    const {filter, location, mapPosition, updateFilter, moveMap} = this.props
    const {center, zoom} = mapPosition
    const {query} = location

    // If `filter` is not set, try to read it from the URL query parameter
    // and update the application state.
    if (!filter && query.filter) {
      try {
        updateFilter(JSON.parse(query.filter))
      } catch (e) {
        console.warn('Invalid filter:', decodeURI(query.filter))
        // Remove an invalid filter from the URL.
        history.replace({query: {
          ...location.query,
          filter: undefined
        }})
      }
    }

    // If `center` and `zoom` are not set, try to read from the URL query
    // parameter and update the application state.
    if ((!center || !zoom) && !isNaN(+query.lng) && !isNaN(+query.lat) && !isNaN(+query.z)) {
      moveMap({
        zoom: +query.z,
        center: [+query.lng, +query.lat]
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const {filter, mapPosition} = this.props
    const {center, zoom} = nextProps.mapPosition

    // If `filter` has changed, update URL query string to new value
    if (filter !== nextProps.filter) {
      history.replace({
        ...nextProps.location,
        query: {
          ...nextProps.location.query,
          filter: JSON.stringify(nextProps.filter)
        }
      })
    }
    // If `mapPosition` has changed, update URL query string to new value
    if (!deepEqual(mapPosition, nextProps.mapPosition)) {
      history.replace({
        ...nextProps.location,
        query: {
          ...nextProps.location.query,
          z: zoom && roundTo(zoom, 2),
          lng: center && roundTo(center[0], 4),
          lat: center && roundTo(center[1], 4)
        }
      })
    }
  }

  handleMarkerClick = (id) => {
    history.push({
      ...this.props.location,
      pathname: '/features/' + id
    })
  }

  render() {
    const { children, features, filter, mapPosition, params, updateFilter, moveMap} = this.props
    return (
      <div style={style}>
        <Filter
          features={features}
          filterFields={['people', 'happening']}
          filter={filter}
          onUpdate={updateFilter}
        />
        <MapView
          center={mapPosition.center}
          features={features}
          fieldMapping={{
            img: 'picture.url',
            title: 'happening',
            subtitle: 'placename'
          }}
          filter={filter}
          onMove={moveMap}
          onMarkerClick={this.handleMarkerClick}
          zoom={mapPosition.zoom}
        />
        {children && React.cloneElement(children, params)}
      </div>
    )
  }
}

module.exports = connect(
  (state) => state,
  (dispatch) => bindActionCreators(actionCreators, dispatch)
)(App)
