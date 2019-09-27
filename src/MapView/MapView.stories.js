// @flow
import React from 'react'
import { action } from '@storybook/addon-actions'
import { withKnobs, radios } from '@storybook/addon-knobs'

import MapView from './MapView'
import fixtureObs from '../../fixtures/observations.json'

function getMediaUrl(id, size) {
  const pixels = size === 'thumbnail' ? 400 : 1000
  const idx = parseInt(id, 16)
  return `https://picsum.photos/id/${+idx % 80}/${pixels}/${pixels}`
}

function getFilteredObservations(filter) {
  return filter === '**all**'
    ? fixtureObs
    : fixtureObs.filter(
        o => o.tags.happening && o.tags.happening.includes(filter)
      )
}

export default {
  title: 'MapView',
  decorators: [withKnobs]
}

export const defaultStory = () => {
  const options = {
    All: '**all**',
    Mining: 'mining'
  }
  const value = radios('Filter', options, '**all**')
  const filteredObs = getFilteredObservations(value)

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <MapView
        observations={filteredObs}
        onUpdateObservation={action('update')}
        getMediaUrl={getMediaUrl}
        mapboxAccessToken="pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg"
      />
    </div>
  )
}

defaultStory.story = {
  name: 'default'
}
