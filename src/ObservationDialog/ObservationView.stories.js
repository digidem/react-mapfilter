// @flow
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'

import ObservationView from './ObservationViewNew'

const exampleMedia = Array(9)
  .fill()
  .map((_, i) => ({
    url: `https://lorempixel.com/600/400/nature/${i}`,
    type: 'image'
  }))

const exampleObservation = require('../../fixtures/observations.json')[0]

storiesOf('ObservationDialog/components/ObservationView', module).add(
  'default',
  () => (
    <ObservationView
      observation={exampleObservation}
      getMedia={() => exampleMedia}
      onRequestClose={action('close')}
      onSave={action('save')}
    />
  )
)
