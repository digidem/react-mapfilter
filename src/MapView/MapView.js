// @flow
import React from 'react'

import MapViewContent, { type MapViewContentProps } from './MapViewContent'
import ViewWrapper, { type CommonViewProps } from '../ViewWrapper'

type Props = {
  ...$Exact<CommonViewProps>,
  ...$Exact<MapViewContentProps>
}

const MapView = ({
  observations,
  onUpdateObservation,
  getPreset,
  filter,
  getMediaUrl,
  ...otherProps
}: Props) => {
  return (
    <ViewWrapper
      observations={observations}
      onUpdateObservation={onUpdateObservation}
      getPreset={getPreset}
      filter={filter}
      getMediaUrl={getMediaUrl}>
      {({ onClickObservation, filteredObservations, getPreset, getMedia }) => (
        <MapViewContent
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
