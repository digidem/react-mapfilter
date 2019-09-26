// @flow
import React, { useState, useLayoutEffect, useEffect, useMemo } from 'react'
import imagesLoaded from 'imagesloaded'
import { makeStyles } from '@material-ui/core/styles'

import ReportView from './ReportView'
import ObservationDialog from '../ObservationDialog'
import getStats from '../stats'
import Toolbar from '../internal/Toolbar'
import PrintButton from './PrintButton'
import HideFieldsButton from './HideFieldsButton'
import { defaultGetPreset } from '../utils/helpers'
import { fieldKeyToLabel } from '../utils/strings'

import type { Observation } from 'mapeo-schema'
import type { PresetWithFields, GetMedia, CameraOptions } from '../types'

type Props = {
  /** Array of observations to render */
  observations: Array<Observation>,
  /** Called when an observation is editing/updated */
  onUpdateObservation: (observation: Observation) => void,
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
  getPreset?: Observation => PresetWithFields | void,
  /**
   * For a given attachment, return `src` and `type`
   */
  getMedia: GetMedia,
  mapboxAccessToken: string
}

const noop = obs => {}

const WrappedReportView = ({
  onUpdateObservation,
  getPreset = noop,
  ...otherProps
}: Props) => {
  const { observations, getMedia } = otherProps
  const stats = useMemo(() => getStats(observations), [observations])
  const cx = useStyles()
  const [paperSize, setPaperSize] = useState('a4')
  const [print, setPrint] = useState(false)
  const [editingObservation, setEditingObservation] = useState(null)
  const [fieldState, setFieldState] = useState(() => {
    // Lazy initial state to avoid this being calculated on every render
    return Object.keys(stats).map(key => {
      const fieldKey = JSON.parse(key)
      const label = fieldKeyToLabel(fieldKey)
      return {
        id: key,
        hidden: false,
        label: Array.isArray(label) ? label.join('.') : label
      }
    })
  })

  const getPresetWithFallback = (
    observation: Observation
  ): PresetWithFields => {
    const preset = getPreset(observation)
    if (preset) return preset
    return defaultGetPreset(observation, stats)
  }

  const getPresetWithFilteredFields = (
    observation: Observation
  ): PresetWithFields => {
    const preset = getPresetWithFallback(observation)
    return {
      ...preset,
      fields: preset.fields.filter(field => {
        const state = fieldState.find(fs => fs.id === JSON.stringify(field.key))
        return state ? !state.hidden : true
      })
    }
  }

  const handleObservationClick = observationId => {
    setEditingObservation(observations.find(obs => obs.id === observationId))
  }

  useEffect(() => {
    // We can't guarantee that window.print() is blocking, so we don't turn off
    // print view until this event
    const handleAfterPrint = () => {
      setPrint(false)
    }
    window.addEventListener('afterprint', handleAfterPrint)
    return () => window.removeEventListener('afterprint', handleAfterPrint)
  }, [])

  useLayoutEffect(() => {
    if (!print) return
    let didCancel = false
    let timeoutId
    imagesLoaded(document.body, () => {
      if (didCancel) return
      // Wait for map to render
      // TODO: SUPER hacky
      timeoutId = setTimeout(() => {
        window.print()
      }, 1000)
    })
    return () => {
      didCancel = true
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [print])

  return (
    <div className={cx.root}>
      <Toolbar>
        <PrintButton
          requestPrint={() => setPrint(true)}
          changePaperSize={newSize => setPaperSize(newSize)}
          paperSize={paperSize}
        />
        <HideFieldsButton
          fieldState={fieldState}
          onFieldStateUpdate={setFieldState}
        />
      </Toolbar>
      <ReportView
        {...otherProps}
        getPreset={getPresetWithFilteredFields}
        onClick={handleObservationClick}
        paperSize={paperSize}
        print={print}
      />
      <ObservationDialog
        open={!!editingObservation}
        observation={editingObservation}
        getPreset={getPresetWithFallback}
        getMedia={getMedia}
        onRequestClose={() => setEditingObservation(false)}
        onSave={onUpdateObservation}
      />
    </div>
  )
}

export default WrappedReportView

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    width: '100%',
    top: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    '@media only print': {
      width: 'auto',
      height: 'auto',
      position: 'static',
      backgroundColor: 'inherit',
      display: 'block'
    }
  }
}))
