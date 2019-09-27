// @flow
import React from 'react'
import { action } from '@storybook/addon-actions'
import { withKnobs, radios } from '@storybook/addon-knobs'

import MapView from './MapView'
import fixtureObs from '../../fixtures/observations.json'

function getMediaUrl({ id }, { width = 200, height = 200 } = {}) {
  const size = Math.floor(width / 100) * 100
  const idx = parseInt(id, 16)
  return {
    src: `https://picsum.photos/id/${+idx % 80}/${size}/${size}`,
    type: 'image'
  }
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
        apiUrl="http://localhost:5000"
        observations={filteredObs}
        onUpdateObservation={action('update')}
        getMedia={getMediaUrl}
        mapboxAccessToken="pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg"
      />
    </div>
  )
}

defaultStory.story = {
  name: 'default'
}
