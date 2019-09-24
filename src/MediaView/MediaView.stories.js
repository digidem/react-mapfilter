// @flow
import React from 'react'
import { action } from '@storybook/addon-actions'

import MediaView from './MediaView'
import fixtureObs from '../../fixtures/observations.json'

export default {
  title: 'MediaView'
}

export const defaultStory = () => {
  function getMediaUrl({ id }, { width = 200, height = 200 } = {}) {
    const size = Math.floor(width / 100) * 100
    const idx = parseInt(id, 16)
    return `https://picsum.photos/id/${+idx % 80}/${size}/${size}`
  }
  return (
    <MediaView
      observations={fixtureObs}
      onClick={action('click')}
      getMediaUrl={getMediaUrl}
    />
  )
}

defaultStory.story = {
  name: 'default'
}
