// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, radios } from '@storybook/addon-knobs'

import MapView from './MapView'
import fixtureObs from '../../fixtures/observations.json'

storiesOf('MapView', module)
  .addDecorator(withKnobs)
  .add('default', () => {
    function getMediaUrl({ id }, { width = 200, height = 200 } = {}) {
      const size = Math.floor(width / 100) * 100
      const idx = parseInt(id, 16)
      return `https://picsum.photos/id/${+idx % 80}/${size}/${size}`
    }

    const options = {
      All: '**all**',
      Mining: 'mining'
    }
    const value = radios('Filter', options, '**all**')

    const filteredObs =
      value === '**all**'
        ? fixtureObs
        : fixtureObs.filter(
            o => o.tags.happening && o.tags.happening.includes(value)
          )

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
    function getMediaUrl({ id }, { width = 200, height = 200 } = {}) {
      const size = Math.floor(width / 100) * 100
      const idx = parseInt(id, 16)
      return `https://picsum.photos/id/${+idx % 80}/${size}/${size}`
    }

    const options = {
      All: '**all**',
      Mining: 'mining'
    }
    const value = radios('Filter', options, '**all**')

    const filteredObs =
      value === '**all**'
        ? fixtureObs
        : fixtureObs.filter(
            o => o.tags.happening && o.tags.happening.includes(value)
          )

    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
        <MapView
          observations={filteredObs}
          onClick={action('click')}
          getMediaUrl={getMediaUrl}
          mapboxAccessToken="pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg"
          initialPosition={{
            center: [0.16, 51.45],
            zoom: 8
          }}
        />
      </div>
    )
  })
