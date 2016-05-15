const React = require('react')
const { PropTypes } = React
const mapboxgl = require('mapbox-gl')
const extent = require('turf-extent')
const get = require('get-value')
const lintGeoJson = require('geojsonhint').hint
const deepEqual = require('deep-equal')

const config = require('../../config.json')
const popupTemplate = require('../../templates/popup.hbs')

require('../../node_modules/mapbox-gl/dist/mapbox-gl.css')
require('../../css/popup.css')

/* Mapbox [API access token](https://www.mapbox.com/help/create-api-access-token/) */
mapboxgl.accessToken = config.mapboxToken

const DEFAULT_STYLE = 'mapbox://styles/gmaclennan/cio7mcryg0015akm9b6wur5ic'

const emptyFeatureCollection = {
  type: 'FeatureCollection',
  features: []
}

const style = {
  width: '75%',
  height: '100%',
  position: 'absolute',
  right: 0
}

const pointStyleLayer = {
  id: 'features',
  type: 'symbol',
  source: 'features',
  interactive: true,
  layout: {
    'icon-image': 'marker-cab2d6',
    'icon-allow-overlap': true
  }
}

const pointHoverStyleLayer = {
  id: 'features-hover',
  type: 'symbol',
  source: 'features',
  interactive: false,
  filter: ['==', 'id', ''],
  layout: {
    'icon-image': 'marker-cab2d6-hover',
    'icon-allow-overlap': true
  }
}

const noop = (x) => x

/**
 * @private
 * Lints the features GeoJSON and checks if a valid FeatureCollection, single point feature,
 * or multipoint feature. If not, returns an empty FeatureCollection
 * @param {object} features Feature GeoJSON to lint
 * @return {object} No-op if valid GeoJSON, returns empty FC if not valid.
 */
// TODO: Currently only supporting point features, need to support lines and polygons
function lintFeatures (features) {
  const errors = lintGeoJson(features)
  if (errors.length) {
    console.warn('features property is invalid GeoJSON\n', errors)
    return emptyFeatureCollection
  }
  const isFeatureCollection = (features.type.toLowerCase() === 'featurecollection')
  const isPointFeature = (features.type.toLowerCase() === 'feature' && features.geometry.type.toLowerCase === 'point')
  const isMultiPointFeature = (features.type.toLowerCase() === 'feature' && features.geometry.type.toLowerCase === 'multipoint')
  if (isFeatureCollection || isPointFeature || isMultiPointFeature) {
    return features
  }
  console.warn('features must be a FeatureCollection, Point or MultiPoint feature')
  return emptyFeatureCollection
}

/**
 * @private
 * For a given geojson FeatureCollection, return the geographic bounds.
 * For a missing or invalid FeatureCollection, return the bounds for
 * the whole world.
 * @param {object} fc Geojson FeatureCollection
 * @return {array} Bounds in format `[minLng, minLat, maxLng, maxLat]``
 */
function getBounds (fc) {
  // If we don't have data, default to the extent of the whole world
  // NB. Web mercator goes to infinity at lat 90! Use lat 85.
  if (!fc || !fc.features || !fc.features.length) {
    return [-180, -85, 180, 85]
  }
  return extent(fc)
}

class MapView extends React.Component {
  static defaultProps = {
    mapStyle: DEFAULT_STYLE,
    onMarkerClick: noop,
    onMove: noop,
    fieldMapping: {
      img: 'img',
      title: 'title',
      subtitle: 'subtitle'
    }
  }

  static propTypes = {
    /* map center point [lon, lat] */
    center: PropTypes.array,
    /* Geojson FeatureCollection of features to show on map */
    features: PropTypes.object,
    /**
     * Mapping of geojson properties to field names used in template
     * If omitted, will try to find an image field and pick the first
     * two string fields as title and subtitle
     * @type {object}
     */
    fieldMapping: PropTypes.shape({
      img: PropTypes.string,
      title: PropTypes.string,
      subtitle: PropTypes.string
    }),
    /* Current filter (See https://www.mapbox.com/mapbox-gl-style-spec/#types-filter) */
    filter: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string
    ])),
    /**
     * - NOT yet dynamic e.g. if you change it the map won't change
     * Map style. This must be an an object conforming to the schema described in the [style reference](https://mapbox.com/mapbox-gl-style-spec/), or a URL to a JSON style. To load a style from the Mapbox API, you can use a URL of the form `mapbox://styles/:owner/:style`, where `:owner` is your Mapbox account name and `:style` is the style ID. Or you can use one of the predefined Mapbox styles:
     * `mapbox://styles/mapbox/basic-v8` - Simple and flexible starting template.
     * `mapbox://styles/mapbox/bright-v8` - Template for complex custom basemaps.
     * `mapbox://styles/mapbox/streets-v8` - A ready-to-use basemap, perfect for minor customization or incorporating your own data.
     * `mapbox://styles/mapbox/light-v8` - Subtle light backdrop for data vizualizations.
     * `mapbox://styles/mapbox/dark-v8` - Subtle dark backdrop for data vizualizations.
     */
    mapStyle: PropTypes.string,
    /**
     * Triggered when a marker is clicked. Called with a (cloned) GeoJson feature
     * object of the marker that was clicked.
     * @type {function}
     */
    onMarkerClick: PropTypes.func,
    /* Triggered when map is moved, called with map center [lng, lat] */
    onMove: PropTypes.func,
    /* map zoom */
    zoom: PropTypes.number
  }

  handleMapMoveOrZoom = (e) => {
    this.props.onMove({
      center: this.map.getCenter().toArray(),
      zoom: this.map.getZoom(),
      bearing: this.map.getBearing()
    })
  }

  handleMapClick = (e) => {
    var features = this.map.queryRenderedFeatures(
      e.point,
      {layers: ['features', 'features-hover']}
    )
    if (!features.length) return
    this.props.onMarkerClick(features[0].properties.id)
  }

  handleMouseMove = (e) => {
    var features = this.map.queryRenderedFeatures(
      e.point,
      {layers: ['features', 'features-hover']}
    )
    this.map.getCanvas().style.cursor = (features.length) ? 'pointer' : ''
    if (!features.length) {
      this.popup.remove()
      this.map.setFilter('features-hover', ['==', 'id', ''])
      return
    }
    var hoveredFeatureId = features[0].properties.id
    this.map.setFilter('features-hover', ['==', 'id', hoveredFeatureId])
    // Popuplate the popup and set its coordinates
    // based on the feature found.
    if (!this.popup._map || hoveredFeatureId && hoveredFeatureId !== this.popup.__featureId) {
      this.popup.setLngLat(features[0].geometry.coordinates)
        .setHTML(this.getPopupHtml(features[0].properties))
        .addTo(this.map)
        .__featureId = hoveredFeatureId
    }
  }

  /**
   * For a given object, return popupHtml by mapping object fields to
   * `img`, `title`, `subtitle` properties used in the template.
   * @param {object} o object, from geojson `properties`
   * @return {string} HTML string
   */
  getPopupHtml (o) {
    const fieldMapping = this.props.fieldMapping
    const templateContext = Object.keys(fieldMapping).reduce((prev, field) => {
      prev[field] = get(o, fieldMapping[field])
      return prev
    }, {})
    return popupTemplate(templateContext)
  }

  render () {
    return (
      <div
        ref={(el) => (this.mapDiv = el)}
        style={style}
      />
    )
  }

  // The first time our component mounts, render a new map into `mapDiv`
  // with settings from props.
  componentDidMount () {
    const { center, filter, mapStyle, features, zoom } = this.props

    const map = this.map = window.map = new mapboxgl.Map({
      style: mapStyle,
      container: this.mapDiv,
      center: center || [0, 0],
      zoom: zoom || 0
    })

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.Navigation())

    this.popup = new mapboxgl.Popup({
      closeButton: false,
      anchor: 'bottom-left'
    })

    map.on('style.load', () => {
      map.on('moveend', this.handleMapMoveOrZoom)
      map.on('click', this.handleMapClick)
      map.on('mousemove', this.handleMouseMove)
      this.featuresSource = new mapboxgl.GeoJSONSource({
        data: lintFeatures(features)
      })
      map.addSource('features', this.featuresSource)
      // TODO: Should choose style based on whether features are point, line or polygon
      map.addLayer(pointStyleLayer)
      map.addLayer(pointHoverStyleLayer)
      if (filter) {
        map.setFilter('features', filter)
      }
    })

    // If no map center or zoom passed, set map extent to extent of marker layer
    if (!center || !zoom) {
      map.fitBounds(getBounds(features), {padding: 15})
    }
  }

  // We always return false from this function because we don't want React to
  // handle any rendering of the map itself, we do all that via mapboxgl
  shouldComponentUpdate (nextProps) {
    const mapPosition = {
      center: this.map.getCenter().toArray(),
      zoom: this.map.getZoom()
    }
    const nextMapPosition = {
      center: nextProps.center,
      zoom: nextProps.zoom
    }
    const shouldMapMove = nextProps.center && nextProps.zoom &&
      !deepEqual(mapPosition, nextMapPosition)
    if (shouldMapMove) {
      this.map.jumpTo(nextMapPosition)
    }
    // If no map center or zoom passed, set map extent to extent of marker layer
    if (!nextProps.center && !this.props.center || !nextProps.zoom && !this.props.zoom) {
      this.map.fitBounds(getBounds(nextProps.features), {padding: 15})
    }
    if (nextProps.features !== this.props.features) {
      const features = lintFeatures(nextProps.features)
      if (this.map.loaded()) {
        this.featuresSource.setData(features)
      } else {
        this.map.on('style.load', () => this.featuresSource.setData(features))
      }
    }
    if (nextProps.filter !== this.props.filter && nextProps.filter) {
      if (this.map.style.loaded()) {
        this.map.setFilter('features', nextProps.filter)
      } else {
        this.map.on('style.load', () => this.map.setFilter('features', nextProps.filter))
      }
    }
    return false
  }

  componentWillUnmount () {
    this.map.remove()
  }
}

module.exports = MapView
