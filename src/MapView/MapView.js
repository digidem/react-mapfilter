// @flow
import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useImperativeHandle
} from 'react'
import { useIntl } from 'react-intl'
import ReactMapboxGl from 'react-mapbox-gl'
import mapboxgl from 'mapbox-gl'
import type { Observation } from 'mapeo-schema'

import { isImageAttachment } from '../utils/helpers'
import { makeStyles } from '../utils/styles'
import ObservationLayer from './ObservationLayer'
import Popup from './Popup'
import type { Attachment, PresetWithFields } from '../types'

type Props = {
  /** Array of observations to render */
  observations: Array<Observation>,
  /** Called with id of observation clicked */
  onClick?: (id: string) => void,
  /** A function called with an observation that should return a matching preset
   * with field definitions */
  getPreset?: Observation => PresetWithFields,
  /** A function called with an observation attachment that should return a URL
   * to retrieve the attachment. If called with `options.width` and
   * `options.height`, the function should return a URL to a resized image, if
   * available */
  getMediaUrl: (
    attachment: Attachment,
    options?: { width: number, height: number }
  ) => string | void,
  /** Mapbox access token */
  mapboxAccessToken: string,
  mapStyle?: any
}

type Instance = {
  fitBounds: () => any
}

const useStyles = makeStyles({
  container: {
    flex: 1
  }
})

const fitBoundsOptions = {
  duration: 0,
  padding: 10
}

const MapView = (
  {
    observations,
    mapboxAccessToken,
    getPreset,
    getMediaUrl,
    onClick,
    mapStyle = 'mapbox://styles/mapbox/outdoors-v10'
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
    }
  }))

  // We don't want to change the map viewport if the observations array changes,
  // which it will do if the filter changes. We only set the bounds for the very
  // initial render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialBounds = useMemo(() => getBounds(observations), [])

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

  function getLastImageUrl(observation: Observation): string | void {
    const imageAttachments = (observation.attachments || []).filter(
      isImageAttachment
    )
    if (!imageAttachments) return
    return getMediaUrl(imageAttachments[imageAttachments.length - 1], {
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
    <Map
      style={mapStyle}
      className={classes.container}
      fitBounds={initialBounds}
      fitBoundsOptions={fitBoundsOptions}
      onStyleLoad={handleStyleLoad}>
      <ObservationLayer
        observations={observations}
        onClick={onClick}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
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
  )
}

export default React.forwardRef<Props, Instance>(MapView)

function getBounds(observations: Observation[]) {
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
