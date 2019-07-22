// @flow
import React from 'react'
import { IntlProvider } from 'react-intl'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'

import FeatureHeader from './FeatureHeader'

const Wrapper = ({ children }) => (
  <IntlProvider>
    <div style={{ width: 600, outline: 'solid 1px aqua' }}>{children}</div>
  </IntlProvider>
)

storiesOf('internal/FeatureHeader', module)
  .add('default', () => (
    <Wrapper>
      <FeatureHeader
        coords={{ longitude: -51, latitude: 23 }}
        createdAt={new Date()}
      />
    </Wrapper>
  ))
  .add('custom name', () => (
    <Wrapper>
      <FeatureHeader
        name="My Thing"
        coords={{ longitude: -51, latitude: 23 }}
        createdAt={new Date()}
      />
    </Wrapper>
  ))
  .add('no location', () => (
    <Wrapper>
      <FeatureHeader createdAt={new Date()} onClose={action('close')} />
    </Wrapper>
  ))
  .add('no location or date', () => (
    <Wrapper>
      <FeatureHeader onClose={action('close')} />
    </Wrapper>
  ))
  .add('label', () => (
    <Wrapper>
      <FeatureHeader
        iconLabel="C"
        iconColor="red"
        createdAt={new Date()}
        onClose={action('close')}
      />
    </Wrapper>
  ))
