// @flow
import React from 'react'

import MediaViewContent from './MediaViewContent'
import ViewWrapper, { type CommonViewProps } from '../ViewWrapper'

const MapView = ({
  observations,
  onUpdateObservation,
  getPreset,
  filter,
  getMediaUrl,
  ...otherProps
}: CommonViewProps) => {
  return (
    <ViewWrapper
      observations={observations}
      onUpdateObservation={onUpdateObservation}
      getPreset={getPreset}
      filter={filter}
      getMediaUrl={getMediaUrl}>
      {({ onClickObservation, filteredObservations, getPreset, getMedia }) => (
        <MediaViewContent
          onClick={onClickObservation}
          observations={filteredObservations}
          getPreset={getPreset}
          getMedia={getMedia}
          {...otherProps}
        />
      )}
    </ViewWrapper>
  )
}

export default MapView
