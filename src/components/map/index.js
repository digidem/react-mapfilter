import debug from 'debug'
import React from 'react'
const { PropTypes } = React
import mapboxgl from 'mapbox-gl'
import deepEqual from 'deep-equal'
import assign from 'object-assign'
import featureFilter from 'feature-filter-geojson'

import * as MFPropTypes from '../../util/prop_types'
import { getBoundsOrWorld } from '../../util/map_helpers'

import config from '../../../config.json'
import Popup from './popup'

require('mapbox-gl/dist/mapbox-gl.css')

/* Mapbox [API access token](https://www.mapbox.com/help/create-api-access-token/) */
mapboxgl.accessToken = config.mapboxToken

const log = debug('mf:mapview')

let savedMap
let savedMapDiv

const emptyGeoJson = {
  type: 'FeatureCollection',
  features: []
}

const labelStyleLayer = {
  id: 'labels',
  type: 'symbol',
  source: 'features',
  layout: {
    'text-field': '',
    'text-allow-overlap': true,
    'text-ignore-placement': true,
    'text-size': 10,
    'text-font': ['Open Sans Bold']
  },
  paint: {
    'text-color': '#fff',
    'text-halo-color': 'rgba(100,100,100, 0.3)',
    'text-halo-width': 0.5
  }
}

const pointStyleLayer = {
  id: 'points',
  type: 'circle',
  source: 'features',
  paint: {
    // make circles larger as the user zooms from z12 to z22
    'circle-radius': {
      'base': 1.5,
      'stops': [[7, 5], [18, 50]]
    },
    'circle-color': {
      'property': '__mf_color',
      'type': 'identity'
    },
    'circle-opacity': 0.75,
    'circle-stroke-width': 1.5,
    'circle-stroke-color': '#ffffff',
    'circle-stroke-opacity': 0.9
  }
}

const pointHoverStyleLayer = {
  id: 'points-hover',
  type: 'circle',
  source: 'hover',
  paint: assign({}, pointStyleLayer.paint, {
    'circle-opacity': 1,
    'circle-stroke-width': 2.5,
    'circle-stroke-color': '#ffffff',
    'circle-stroke-opacity': 1
  })
}

const noop = (x) => x

class MapView extends React.Component {
  static defaultProps = {
    features: [],
    showFeatureDetail: noop,
    moveMap: noop,
    interactive: true,
    labelPoints: false
  }

  static propTypes = {
    /* map center point [lon, lat] */
    center: PropTypes.array,
    /* Geojson FeatureCollection of features to show on map */
    features: PropTypes.arrayOf(MFPropTypes.mapViewFeature).isRequired,
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
    showFeatureDetail: PropTypes.func,
    /* Triggered when map is moved, called with map center [lng, lat] */
    moveMap: PropTypes.func,
    fieldMapping: MFPropTypes.fieldMapping,
    /* map zoom */
    zoom: PropTypes.number,
    interactive: PropTypes.bool
  }

  state = {}

  handleMapMoveOrZoom = (e) => {
    this.props.moveMap({
      center: this.map.getCenter().toArray(),
      zoom: this.map.getZoom(),
      bearing: this.map.getBearing()
    })
  }

  handleMapClick = (e) => {
    // if (!this.map.loaded()) return
    var features = this.map.queryRenderedFeatures(
      e.point,
      {layers: ['points-hover']}
    )
    if (!features.length) return
    this.setState({lngLat: null})
    this.props.showFeatureDetail(features[0].properties.__mf_id)
  }

  handleMouseMove = (e) => {
    if (!this.map.loaded()) return
    var features = this.map.queryRenderedFeatures(
      e.point,
      {layers: ['points', 'points-hover']}
    )
    this.map.getCanvas().style.cursor = (features.length) ? 'pointer' : ''
    if (!features.length) {
      this.setState({lngLat: null})
      this.map.getSource('hover').setData(emptyGeoJson)
      return
    }
    this.map.getSource('hover').setData(features[0])
    this.setState({lngLat: features[0].geometry.coordinates})
    this.setState(this.getPopupProps(features[0].properties))
  }

  ready (fn) {
    const self = this
    if (this.map.loaded()) {
      fn()
    } else {
      this.map.once('load', () => {
        console.log('loaded', this.map.loaded())
        fn.call(self)
      })
    }
  }

  getPopupProps (featureProps) {
    const fieldMapping = this.props.fieldMapping
    return Object.keys(fieldMapping).reduce((prev, field) => {
      prev[field] = featureProps[fieldMapping[field]]
      return prev
    }, {})
  }

  render () {
    return (
      <div style={{width: '100%', height: '100%', position: 'absolute'}}>
        <div
          ref={(el) => (this.mapContainer = el)}
          style={{width: '100%', height: '100%'}}
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
    const { center, interactive, filter, labelPoints, mapStyle, zoom } = this.props
    let map

    if (savedMap) {
      this.mapContainer.appendChild(savedMapDiv)
      map = this.map = savedMap
      map.resize()
      this.updateIfNeeded(this.props)
      if (interactive) {
        this.ready(() => {
          map.on('moveend', this.handleMapMoveOrZoom)
          map.on('click', this.handleMapClick)
          map.on('mousemove', this.handleMouseMove)
        })
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

    this.geojson = this.getGeoJson(this.props)

    map.once('load', () => {
      if (interactive) {
        map.on('moveend', this.handleMapMoveOrZoom)
        map.on('click', this.handleMapClick)
        map.on('mousemove', this.handleMouseMove)
      }
      map.addSource('features', {type: 'geojson', data: this.geojson})
      // TODO: Should choose style based on whether features are point, line or polygon
      map.addSource('hover', {type: 'geojson', data: emptyGeoJson})
      map.addLayer(pointStyleLayer)
      map.addLayer(pointHoverStyleLayer)
      map.addLayer(labelStyleLayer)
      if (filter) {
        map.setFilter('points', filter)
        map.setFilter('labels', filter)
      }
      if (labelPoints) {
        map.setLayoutProperty('labels', 'text-field', '{__mf_label}')
      }
    })

    // If no map center or zoom passed, set map extent to extent of marker layer
    if (!center || !zoom) {
      this.centerMap(this.geojson)
    }
  }

  componentWillReceiveProps (nextProps) {
    this.ready(() => this.updateIfNeeded(nextProps, this.props))
  }

  componentWillUnmount () {
    this.map.off('moveend', this.handleMapMoveOrZoom)
    this.map.off('click', this.handleMapClick)
    this.map.off('mousemove', this.handleMouseMove)
  }

  updateIfNeeded (nextProps, props = {}) {
    const {mapStyle, disableScrollToZoom} = props
    let isDataUpdated = false
    let shouldDataUpdate = nextProps.features !== props.features ||
      nextProps.fieldMapping !== props.fieldMapping ||
      nextProps.colorIndex !== props.colorIndex ||
      (nextProps.filter !== props.filter && props.labelPoints)

    if (shouldDataUpdate) {
      this.geojson = this.getGeoJson(nextProps)
      console.log(this.geojson)
      this.ready(() => {
        console.log('setting source', this.geojson)
        this.map.getSource('features').setData(this.geojson)
      })
      isDataUpdated = true
    }
    if (isDataUpdated && !nextProps.center || !nextProps.zoom) {
      this.centerMap(this.geojson)
    }
    this.updateFilterIfNeeded(nextProps.filter)

    if (mapStyle !== nextProps.mapStyle) {
      this.map.setStyle(nextProps.mapStyle)
    }

    if (disableScrollToZoom !== nextProps.disableScrollToZoom) {
      nextProps.disableScrollToZoom ? this.map.scrollZoom.disable() : this.map.scrollZoom.enable()
    }

    const textField = nextProps.labelPoints ? '{__mf_label}' : ''
    this.ready(() => {
      if (this.map.getLayoutProperty('labels', 'text-field') !== textField) {
        this.map.setLayoutProperty('labels', 'text-field', textField)
      }
    })
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

  updateFilterIfNeeded (filter) {
    if (filter !== this.props.filter && filter) {
      log('new filter')
      if (this.map.style.loaded()) {
        this.map.setFilter('points', filter)
      } else {
        this.map.on('load', () => this.map.setFilter('points', filter))
      }
    }
  }

  // Construct GeoJSON for map
  getGeoJson ({features = [], fieldMapping = {}, colorIndex = {}, filter = []}) {
    let i = 0
    const ff = featureFilter(filter)
    return {
      type: 'FeatureCollection',
      features: features
        .filter(f => f.geometry)
        .map(f => {
          const newFeature = {
            type: 'feature',
            geometry: f.geometry,
            properties: assign({}, f.properties, {
              __mf_id: f.id,
              __mf_color: colorIndex[f.properties[fieldMapping.color]]
            })
          }
          if (ff(f)) newFeature.properties.__mf_label = config.labelChars.charAt(i++)
          return newFeature
        })
    }
  }
}

export default MapView
