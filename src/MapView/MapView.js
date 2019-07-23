// @flow
import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useImperativeHandle
} from 'react'
import { useIntl, IntlProvider } from 'react-intl'
import ReactMapboxGl from 'react-mapbox-gl'
import mapboxgl from 'mapbox-gl'
import type { Observation } from 'mapeo-schema'

import { getLastImage } from '../utils/helpers'
import { makeStyles } from '../utils/styles'
import ObservationLayer from './ObservationLayer'
import Popup from './Popup'
import type { PresetWithFields, GetMediaUrl, CameraOptions } from '../types'

type Props = {
  /** Array of observations to render */
  observations: Array<Observation>,
  /** Called with id of observation clicked */
  onClick?: (id: string) => any,
  /** Called with
   * [CameraOptions](https://docs.mapbox.com/mapbox-gl-js/api/#cameraoptions)
   * with properties `center`, `zoom`, `bearing`, `pitch` */
  onMapMove?: CameraOptions => any,
  /** Initial position of the map - an object with properties `center`, `zoom`,
   * `bearing`, `pitch`. If this is not set then the map will by default zoom to
   * the bounds of the observations. If you are going to unmount and re-mount
   * this component (e.g. within tabs) then you will want to use onMove to store
   * the position in state, and pass it as initialPosition for when the map
   * re-mounts. */
  initialMapPosition?: $Shape<CameraOptions>,
  /** A function called with an observation that should return a matching preset
   * with field definitions */
  getPreset?: Observation => PresetWithFields,
  /** A function called with an observation attachment that should return a URL
   * to retrieve the attachment. If called with `options.width` and
   * `options.height`, the function should return a URL to a resized image, if
   * available */
  getMediaUrl: GetMediaUrl,
  /** Mapbox access token */
  mapboxAccessToken: string,
  mapStyle?: any,
  print?: boolean
}

type Instance = {
  fitBounds: () => any,
  flyTo: () => any
}

const useStyles = makeStyles({
  container: {
    flex: 1
  },
  '@global': {
    // The "Improve Map" link does not work when Mapeo Desktop is used offline,
    // and since the data the user is looking at is mainly data that is not in
    // OpenStreetMap, this link does not make much sense to the user.
    '.mapbox-improve-map': {
      display: 'none'
    }
  }
})

const fitBoundsOptions = {
  duration: 0,
  padding: 10
}

const noop = () => {}

const MapView = (
  {
    observations,
    mapboxAccessToken,
    getPreset,
    getMediaUrl,
    onClick,
    initialMapPosition = {},
    onMapMove = noop,
    mapStyle = 'mapbox://styles/mapbox/outdoors-v10',
    print = false
  }: Props,
  ref
) => {
  const map = useRef()
  const classes = useStyles()
  const intl = useIntl()
  const [hovered, setHovered] = useState<?Observation>(null)

  useImperativeHandle(ref, () => ({
    fitBounds: (...args: any) => {
      if (!map.current) return
      map.current.fitBounds.apply(map.current, args)
    },
    flyTo: (...args: any) => {
      if (!map.current) return
      map.current.flyTo.apply(map.current, args)
    }
  }))

  // We don't want to change the map viewport if the observations array changes,
  // which it will do if the filter changes. We only set the bounds for the very
  // initial render, and only if initialMapPosition zoom and center are not set.
  const initialBounds = useMemo(
    () =>
      initialMapPosition.center == null && initialMapPosition.zoom == null
        ? getBounds(observations)
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  console.log(initialBounds)

  // We don't allow the map to be a controlled component - position can only be
  // set when the map is initially mounted and after that state is internal
  const position = useMemo(() => {
    const { center, zoom, bearing, pitch } = initialMapPosition
    const bounds = getBounds(observations)
    // initialMapPosition overrides default behaviour of fitting the map to the
    // bounds of the observations, but if any properties of initialMapPosition are
    // we set some default values
    return {
      center: center || [
        (bounds[1][0] - bounds[0][0]) / 2,
        (bounds[1][1] - bounds[0][1]) / 2
      ],
      zoom: zoom ? [zoom] : [12],
      bearing: bearing ? [bearing] : [0],
      pitch: pitch ? [pitch] : [0]
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const Map = useMemo(
    () =>
      ReactMapboxGl({
        accessToken: mapboxAccessToken,
        dragRotate: false,
        pitchWithRotate: false,
        attributionControl: false,
        logoPosition: 'bottom-right'
      }),
    [mapboxAccessToken]
  )

  const handleStyleLoad = useCallback(mapInstance => {
    mapInstance.addControl(new mapboxgl.NavigationControl({}))
    mapInstance.addControl(new mapboxgl.ScaleControl({}))
    mapInstance.addControl(
      new mapboxgl.AttributionControl({
        compact: true
      })
    )
    map.current = mapInstance
  }, [])

  const handleMouseMove = useCallback(
    e => {
      if (e.features.length === 0) return setHovered(null)
      const obs = observations.find(
        obs => obs.id === e.features[0].properties.id
      )
      setHovered(obs)
    },
    [observations]
  )

  const handleMouseLeave = useCallback(e => {
    setHovered(null)
  }, [])

  const handleMapMove = useCallback(
    (map, e) => {
      onMapMove({
        center: map.getCenter().toArray(),
        zoom: map.getZoom(),
        bearing: map.getBearing(),
        pitch: map.getPitch()
      })
    },
    [onMapMove]
  )

  function getLastImageUrl(observation: Observation): string | void {
    const lastImageAttachment = getLastImage(observation)
    if (!lastImageAttachment) return
    return getMediaUrl(lastImageAttachment, {
      width: Popup.imageSize,
      height: Popup.imageSize
    })
  }

  function getName(observation: Observation): string {
    if (!getPreset) return 'Observation'
    const preset = getPreset(observation)
    if (!preset || !preset.name) return 'Observation'
    return preset.name
  }

  return (
    <IntlProvider>
      <Map
        style={mapStyle}
        className={classes.container}
        fitBounds={initialBounds}
        fitBoundsOptions={fitBoundsOptions}
        onStyleLoad={handleStyleLoad}
        onMove={handleMapMove}
        {...position}>
        <ObservationLayer
          observations={observations}
          onClick={onClick}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          print={print}
        />
        {hovered && (
          <Popup
            imageUrl={getLastImageUrl(hovered)}
            title={getName(hovered)}
            subtitle={intl.formatTime(hovered.created_at, {
              year: 'numeric',
              month: 'long',
              day: '2-digit'
            })}
            coordinates={
              // $FlowFixMe - these are always non-nullish when on a map
              [hovered.lon, hovered.lat]
            }
          />
        )}
      </Map>
    </IntlProvider>
  )
}

export default React.forwardRef<Props, Instance>(MapView)

function getBounds(
  observations: Observation[]
): [[number, number], [number, number]] {
  const extent = [[-180, -85], [180, 85]]
  for (const { lat, lon } of observations) {
    if (lon == null || lat == null) continue
    if (extent[0][0] < lon) extent[0][0] = lon
    if (extent[0][1] < lat) extent[0][1] = lat
    if (extent[1][0] > lon) extent[1][0] = lon
    if (extent[1][1] > lat) extent[1][1] = lat
  }
  return extent
}