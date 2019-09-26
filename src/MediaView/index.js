// @flow
import React, { useState, useMemo } from 'react'

import MediaView from './MediaView'
import ObservationDialog from '../ObservationDialog'
import getStats from '../stats'
import { defaultGetPreset } from '../utils/helpers'

import type { Observation } from 'mapeo-schema'
import type { PresetWithFields, GetMedia } from '../types'

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
  getMedia: GetMedia
}

const noop = obs => {}

const WrappedMediaView = ({
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
      <MediaView
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

export default WrappedMediaView
