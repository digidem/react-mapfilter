// @flow
import React, { useState, useLayoutEffect, useEffect, useMemo } from 'react'
import imagesLoaded from 'imagesloaded'
import { makeStyles } from '@material-ui/core/styles'

import ReportViewContent, {
  type ReportViewContentProps
} from './ReportViewContent'
import ViewWrapper, { type CommonViewProps } from '../ViewWrapper'
import Toolbar from '../internal/Toolbar'
import PrintButton from './PrintButton'
import HideFieldsButton from './HideFieldsButton'
import { fieldKeyToLabel } from '../utils/strings'
import getStats from '../stats'

import type { Observation } from 'mapeo-schema'
import type { PresetWithAdditionalFields } from '../types'

type Props = {
  ...$Exact<CommonViewProps>,
  ...$Exact<ReportViewContentProps>
}

const ReportView = ({
  observations,
  onUpdateObservation,
  getPreset,
  filter,
  apiUrl,
  ...otherProps
}: Props) => {
  const stats = useMemo(() => getStats(observations), [observations])
  const cx = useStyles()
  const [paperSize, setPaperSize] = useState('a4')
  const [print, setPrint] = useState(false)

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
    <ViewWrapper
      observations={observations}
      onUpdateObservation={onUpdateObservation}
      getPreset={getPreset}
      filter={filter}
      apiUrl={apiUrl}>
      {({ onClickObservation, filteredObservations, getPreset, getMedia }) => {
        // Get preset with fields filtered out
        const getPresetWithFilteredFields = (
          observation: Observation
        ): PresetWithAdditionalFields => {
          const preset = getPreset(observation)
          return {
            ...preset,
            fields: preset.fields.filter(field => {
              const state = fieldState.find(
                fs => fs.id === JSON.stringify(field.key)
              )
              return state ? !state.hidden : true
            }),
            additionalFields: preset.additionalFields.filter(field => {
              const state = fieldState.find(
                fs => fs.id === JSON.stringify(field.key)
              )
              return state ? !state.hidden : true
            })
          }
        }
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
            <ReportViewContent
              onClick={onClickObservation}
              observations={filteredObservations}
              getPreset={getPresetWithFilteredFields}
              getMedia={getMedia}
              paperSize={paperSize}
              print={print}
              {...otherProps}
            />
          </div>
        )
      }}
    </ViewWrapper>
  )
}

export default ReportView

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
