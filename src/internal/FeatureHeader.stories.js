// @flow
import React from 'react'
import { storiesOf, addDecorator } from '@storybook/react'
import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'

import FeatureHeader from './FeatureHeader'

addDecorator(storyFn => (
  <div style={{ width: 600, outline: 'solid 1px aqua' }}>{storyFn()}</div>
))

storiesOf('internal/FeatureHeader', module)
  .add('default', () => (
    <FeatureHeader
      coords={{ longitude: -51, latitude: 23 }}
      createdAt={new Date()}
    />
  ))
  .add('custom name', () => (
    <FeatureHeader
      name="My Thing"
      coords={{ longitude: -51, latitude: 23 }}
      createdAt={new Date()}
    />
  ))
  .add('no location', () => (
    <FeatureHeader createdAt={new Date()} onClose={action('close')} />
  ))
  .add('no location or date', () => <FeatureHeader onClose={action('close')} />)
  .add('label', () => (
    <FeatureHeader
      iconLabel="C"
      iconColor="red"
      createdAt={new Date()}
      onClose={action('close')}
    />
  ))
