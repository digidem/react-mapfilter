// @flow
import React, { useState, useMemo } from 'react'

import MapView from './MapView'
import ObservationDialog from '../ObservationDialog'
import getStats from '../stats'
import { defaultGetPreset } from '../utils/helpers'

import type { Observation } from 'mapeo-schema'
import type { PresetWithFields, GetMedia, CameraOptions } from '../types'

type Props = {
  /** Array of observations to render */
  observations: Array<Observation>,
  /** Called when an observation is editing/updated */
  onUpdateObservation: (observation: Observation) => void,
  /** A function called with an observation that should return a matching preset
   * with field definitions */
  getPreset?: Observation => PresetWithFields | void,
  /**
   * For a given attachment, return `src` and `type`
   */
  getMedia: GetMedia,
  mapboxAccessToken: string,
  mapStyle?: any,
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
  initialMapPosition?: $Shape<CameraOptions>
}

const noop = obs => {}

const WrappedMapView = ({
  onUpdateObservation,
  getPreset = noop,
  ...otherProps
}: Props) => {
  const { observations, getMedia } = otherProps
  const stats = useMemo(() => getStats(observations), [observations])
  const [editingObservation, setEditingObservation] = useState(null)
  const [editingInitialImageIndex, setEditingInitialImageIndex] = useState()

  const getPresetWithFallback = (
    observation: Observation
  ): PresetWithFields => {
    const preset = getPreset(observation)
    if (preset) return preset
    return defaultGetPreset(observation, stats)
  }

  const handleObservationClick = (observationId, imageIndex) => {
    setEditingInitialImageIndex(imageIndex)
    setEditingObservation(observations.find(obs => obs.id === observationId))
  }

  return (
    <>
      <MapView
        {...otherProps}
        getPreset={getPresetWithFallback}
        onClick={handleObservationClick}
      />
      <ObservationDialog
        open={!!editingObservation}
        observation={editingObservation}
        initialImageIndex={editingInitialImageIndex}
        getPreset={getPresetWithFallback}
        getMedia={getMedia}
        onRequestClose={() => setEditingObservation(false)}
        onSave={onUpdateObservation}
      />
    </>
  )
}

export default WrappedMapView
