// @flow
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'

import FeatureHeader from './FeatureHeader'

const Wrapper = ({ children }) => (
  <div style={{ width: 600, outline: 'solid 1px aqua' }}>{children}</div>
)

storiesOf('internal/FeatureHeader', module)
  .add('default', () => (
    <Wrapper>
      <FeatureHeader
        name="Observation"
        coords={{ longitude: -51, latitude: 23 }}
        createdAt={new Date()}
      />
    </Wrapper>
  ))
  .add('no location', () => (
    <Wrapper>
      <FeatureHeader
        name="Observation"
        createdAt={new Date()}
        onClose={action('close')}
      />
    </Wrapper>
  ))
  .add('no location or date', () => (
    <Wrapper>
      <FeatureHeader name="Observation" onClose={action('close')} />
    </Wrapper>
  ))
  .add('label', () => (
    <Wrapper>
      <FeatureHeader
        name="Observation"
        iconLabel="C"
        iconColor="red"
        createdAt={new Date()}
        onClose={action('close')}
      />
    </Wrapper>
  ))
