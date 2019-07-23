// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, radios } from '@storybook/addon-knobs'

import MapView from './MapView'
import fixtureObs from '../../fixtures/observations.json'

function getMediaUrl({ id }, { width = 200, height = 200 } = {}) {
  const size = Math.floor(width / 100) * 100
  const idx = parseInt(id, 16)
  return `https://picsum.photos/id/${+idx % 80}/${size}/${size}`
}

function getFilteredObservations(filter) {
  return filter === '**all**'
    ? fixtureObs
    : fixtureObs.filter(
        o => o.tags.happening && o.tags.happening.includes(filter)
      )
}

storiesOf('MapView', module)
  .addDecorator(withKnobs)
  .add('default', () => {
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
          onClick={action('click')}
          getMediaUrl={getMediaUrl}
          mapboxAccessToken="pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg"
        />
      </div>
    )
  })
  .add('initial position', () => {
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
          onClick={action('click')}
          getMediaUrl={getMediaUrl}
          mapboxAccessToken="pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg"
          initialMapPosition={{
            center: [0.16, 51.45],
            zoom: 8
          }}
        />
      </div>
    )
  })
  .add('Imperative methods', () => {
    const options = {
      All: '**all**',
      Mining: 'mining'
    }
    const value = radios('Filter', options, '**all**')
    const filteredObs = getFilteredObservations(value)

    const MapViewWrapper = () => {
      const ref = React.useRef<any>()

      const handleFlyClick = () => {
        if (!ref.current) return
        ref.current.flyTo({ center: [0.16, 51.45], zoom: 8 })
      }

      const handleFitBoundsClick = () => {
        if (!ref.current) return
        ref.current.fitBounds([[-59, 3.1], [-60, 2.1]])
      }

      return (
        <>
          <MapView
            ref={ref}
            observations={filteredObs}
            onClick={action('click')}
            getMediaUrl={getMediaUrl}
            mapboxAccessToken="pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg"
          />
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              display: 'flex',
              flexDirection: 'column'
            }}>
            <button style={{ marginBottom: 5 }} onClick={handleFlyClick}>
              Fly to London
            </button>
            <button onClick={handleFitBoundsClick}>Zoom to data bounds</button>
          </div>
        </>
      )
    }

    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
        <MapViewWrapper />
      </div>
    )
  })