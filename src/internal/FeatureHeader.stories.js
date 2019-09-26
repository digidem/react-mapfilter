// @flow
import React from 'react'
import { addDecorator } from '@storybook/react'
import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'

import FeatureHeader from './FeatureHeader'

addDecorator(storyFn => (
  <div style={{ width: 600, outline: 'solid 1px aqua' }}>{storyFn()}</div>
))

export default {
  title: 'internal/FeatureHeader'
}

export const defaultStory = () => (
  <FeatureHeader
    coords={{ longitude: -51, latitude: 23 }}
    createdAt={new Date()}
  />
)

defaultStory.story = {
  name: 'default'
}

export const customName = () => (
  <FeatureHeader
    name="My Thing"
    coords={{ longitude: -51, latitude: 23 }}
    createdAt={new Date()}
  />
)

customName.story = {
  name: 'custom name'
}

export const noLocation = () => <FeatureHeader createdAt={new Date()} />

noLocation.story = {
  name: 'no location'
}

export const noLocationOrDate = () => <FeatureHeader />

noLocationOrDate.story = {
  name: 'no location or date'
}

export const label = () => (
  <FeatureHeader
    iconLabel="C"
    iconColor="red"
    createdAt={new Date()}
    onClose={action('close')}
  />
)
