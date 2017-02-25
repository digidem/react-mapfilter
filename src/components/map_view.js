import { connect } from 'react-redux'
import debug from 'debug'
import React from 'react'
const { PropTypes } = React
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import deepEqual from 'deep-equal'

import * as MFPropTypes from '../util/prop_types'
import { getBoundsOrWorld } from '../util/map_helpers'

import config from '../../config.json'
import Popup from './popup'

require('mapbox-gl/dist/mapbox-gl.css')

/* Mapbox [API access token](https://www.mapbox.com/help/create-api-access-token/) */
mapboxgl.accessToken = config.mapboxToken

const log = debug('mf:mapview')

const emptyFeatureCollection = {
  type: 'FeatureCollection',
  features: []
}

let savedMap
let savedMapDiv

const pointStyleLayer = {
  id: 'features',
  type: 'symbol',
  source: 'features',
  layout: {
    'icon-image': 'marker-{__mf_color}',
    'icon-allow-overlap': true,
    'icon-ignore-placement': true,
    'icon-offset': [0, -10],
    'text-field': '',
    'text-allow-overlap': true,
    'text-ignore-placement': true,
    'text-size': 10,
    'text-font': ['Open Sans Bold']
  },
  paint: {
    'text-color': '#fff',
    'text-translate': [0, -12],
    'text-halo-color': 'rgba(100,100,100, 0.3)',
    'text-halo-width': 0.5
  }
}

const pointHoverStyleLayer = {
  id: 'features-hover',
  type: 'symbol',
  source: 'features',
  filter: ['==', '__mf_id', ''],
  layout: {
    'icon-image': 'marker-{__mf_color}-hover',
    'icon-allow-overlap': true,
    'icon-ignore-placement': true,
    'icon-offset': [0, -10]
  }
}

const noop = (x) => x

class MapView extends React.Component {
  static defaultProps = {
    geojson: emptyFeatureCollection,
    onMarkerClick: noop,
    onMove: noop,
    style: {
      height: '100%',
      width: '100%'
    },
    interactive: true,
    labelPoints: false
  }

  static propTypes = {
    /* map center point [lon, lat] */
    center: PropTypes.array,
    /* Geojson FeatureCollection of features to show on map */
    geojson: PropTypes.shape({
      type: PropTypes.oneOf(['FeatureCollection']).isRequired,
      features: PropTypes.arrayOf(MFPropTypes.mapViewFeature).isRequired
    }),
    /* Current filter (See https://www.mapbox.com/mapbox-gl-style-spec/#types-filter) */
    filter: MFPropTypes.mapboxFilter,
    /**
     * - NOT yet dynamic e.g. if you change it the map won't change
     * Map style. This must be an an object conforming to the schema described in the [style reference](https://mapbox.com/mapbox-gl-style-spec/), or a URL to a JSON style. To load a style from the Mapbox API, you can use a URL of the form `mapbox://styles/:owner/:style`, where `:owner` is your Mapbox account name and `:style` is the style ID. Or you can use one of the predefined Mapbox styles.
     */
    mapStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    labelPoints: PropTypes.bool,
    /**
     * Triggered when a marker is clicked. Called with a (cloned) GeoJson feature
     * object of the marker that was clicked.
     */
    onMarkerClick: PropTypes.func,
    /* Triggered when map is moved, called with map center [lng, lat] */
    onMove: PropTypes.func,
    fieldMapping: MFPropTypes.fieldMapping,
    /* map zoom */
    zoom: PropTypes.number,
    /* container styling */
    style: PropTypes.object,
    disableScrollToZoom: PropTypes.bool
  }

  state = {}

  handleMapMoveOrZoom = (e) => {
    this.props.onMove({
      center: this.map.getCenter().toArray(),
      zoom: this.map.getZoom(),
      bearing: this.map.getBearing()
    })
  }

  handleMapClick = (e) => {
    if (!this.map.loaded()) return
    var features = this.map.queryRenderedFeatures(
      e.point,
      {layers: ['features', 'features-hover']}
    )
    if (!features.length) return
    this.setState({lngLat: null})
    this.props.onMarkerClick(features[0].properties.__mf_id)
  }

  handleMouseMove = (e) => {
    if (!this.map.loaded()) return
    var features = this.map.queryRenderedFeatures(
      e.point,
      {layers: ['features', 'features-hover']}
    )
    this.map.getCanvas().style.cursor = (features.length) ? 'pointer' : ''
    if (!features.length) {
      this.setState({lngLat: null})
      this.map.setFilter('features-hover', ['==', '__mf_id', ''])
      return
    }
    this.map.setFilter('features-hover', ['==', '__mf_id', features[0].properties.__mf_id])
    this.setState({lngLat: features[0].geometry.coordinates})
    this.setState(this.getPopupProps(features[0].properties))
  }

  getPopupProps (featureProps) {
    const fieldMapping = this.props.fieldMapping
    return Object.keys(fieldMapping).reduce((prev, field) => {
      prev[field] = featureProps[fieldMapping[field]]
      return prev
    }, {})
  }

  render () {
    const { style } = this.props

    return (
      <div style={{width: '100%', height: '100%', position: 'absolute'}}>
        <div
          ref={(el) => (this.mapContainer = el)}
          style={style}
        />
        {this.state.lngLat && <Popup map={this.map} {...this.state} />}
      </div>
    )
  }

  centerMap (geojson) {
    const bounds = getBoundsOrWorld(geojson)

    // workaround for https://github.com/mapbox/mapbox-gl-js/issues/3307
    // (more than 1 point with the same coordinates)
    if (bounds[0] === bounds[2] && bounds[1] === bounds[3]) {
      this.map.setCenter(bounds.slice(0, 2))
    } else {
      this.map.fitBounds(getBoundsOrWorld(geojson), {padding: 15})
    }
  }

  // The first time our component mounts, render a new map into `mapDiv`
  // with settings from props.
  componentDidMount () {
    const { center, interactive, filter, labelPoints, mapStyle, geojson, zoom } = this.props
    let map

    if (savedMap) {
      this.mapContainer.appendChild(savedMapDiv)
      map = this.map = savedMap
      map.resize()
      this.componentWillReceiveProps(this.props)
      if (interactive) {
        map.on('moveend', this.handleMapMoveOrZoom)
        map.on('click', this.handleMapClick)
        map.on('mousemove', this.handleMouseMove)
      }
      return
    }
    const mapDiv = savedMapDiv = document.createElement('div')
    mapDiv.style.height = '100%'
    mapDiv.style.width = '100%'
    this.mapContainer.appendChild(mapDiv)

    map = this.map = savedMap = new mapboxgl.Map({
      style: mapStyle,
      container: mapDiv,
      center: center || [0, 0],
      zoom: zoom || 0
    })

    if (!interactive) {
      map.scrollZoom.disable()
    }

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl())
    map.dragRotate.disable()
    map.touchZoomRotate.disableRotation()

    map.once('load', () => {
      if (interactive) {
        map.on('moveend', this.handleMapMoveOrZoom)
        map.on('click', this.handleMapClick)
        map.on('mousemove', this.handleMouseMove)
      }
      map.addSource('features', {type: 'geojson', data: geojson})
      // TODO: Should choose style based on whether features are point, line or polygon

      map.addLayer(pointStyleLayer)
      map.addLayer(pointHoverStyleLayer)
      if (filter) {
        map.setFilter('features', filter)
      }
      if (labelPoints) {
        map.setLayoutProperty('features', 'text-field', '{__mf_label}')
      }
    })

    // If no map center or zoom passed, set map extent to extent of marker layer
    if (!center || !zoom) {
      this.centerMap(geojson)
    }
  }

  componentWillReceiveProps (nextProps) {
    this.moveIfNeeded(nextProps.center, nextProps.zoom)
    const isDataUpdated = this.updateDataIfNeeded(
      nextProps.geojson,
      nextProps.coloredField
    )
    if (isDataUpdated && !nextProps.center || !nextProps.zoom) {
      this.centerMap(nextProps.geojson)
    }
    this.updateFilterIfNeeded(nextProps.filter)

    if (this.props.mapStyle !== nextProps.mapStyle) {
      this.map.setStyle(nextProps.mapStyle)
    }

    if (this.props.disableScrollToZoom !== nextProps.disableScrollToZoom) {
      nextProps.disableScrollToZoom ? this.map.scrollZoom.disable() : this.map.scrollZoom.enable()
    }

    const textField = nextProps.labelPoints ? '{__mf_label}' : ''
    if (this.map.getLayoutProperty('features', 'text-field') !== textField) {
      this.map.setLayoutProperty('features', 'text-field', textField)
    }
  }

  componentWillUnmount () {
    this.map.off('moveend', this.handleMapMoveOrZoom)
    this.map.off('click', this.handleMapClick)
    this.map.off('mousemove', this.handleMouseMove)
  }

  /**
   * Moves the map to a new position if it is different from the current position
   * @param {array} center new coordinates for center of map
   * @param {number} zoom   new zoom level for map
   * @return {boolean} true if map has moved, otherwise false
   */
  moveIfNeeded (center, zoom) {
    const currentPosition = {
      center: this.map.getCenter().toArray(),
      zoom: this.map.getZoom()
    }
    const newMapPosition = {
      center,
      zoom
    }
    const shouldMapMove = center && zoom &&
      !deepEqual(currentPosition, newMapPosition)
    if (shouldMapMove) {
      log('Moving map')
      this.map.jumpTo(newMapPosition)
      return true
    }
    return false
  }

  /**
   * [updateDataIfNeeded description]
   * @param {[type]} features     [description]
   * @param {[type]} coloredField [description]
   * @return {[type]} [description]
   */
  updateDataIfNeeded (geojson, coloredField) {
    if (geojson === this.geojson &&
        (!coloredField || coloredField === this.coloredField)) {
      return
    }
    this.geojson = geojson
    this.coloredField = coloredField
    log('updated map geojson')
    if (this.map.loaded()) {
      this.map.getSource('features').setData(geojson)
    } else {
      this.map.on('load', () => this.map.getSource('features').setData(geojson))
    }
  }

  updateFilterIfNeeded (filter) {
    if (filter !== this.filter && filter) {
      this.filter = filter
      log('new filter')
      if (this.map.style.loaded()) {
        this.map.setFilter('features', filter)
      } else {
        this.map.on('load', () => this.map.setFilter('features', filter))
      }
    }
  }
}

const mapStateToProps = state => {
  return {
    mapStyle: state.mapStyle
  }
}

export default connect(
  mapStateToProps
)(MapView)
