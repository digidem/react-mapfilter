// @flow
import React from 'react'
import { action } from '@storybook/addon-actions'

import MediaCarousel from './MediaCarousel'

export default {
  title: 'internal/MediaCarousel'
}

export const defaultStory = () => (
  <MediaCarousel
    style={{ width: 600, height: 400, outline: 'solid 1px blue' }}
    attachments={[
      { id: 'http://via.placeholder.com/600' },
      { id: 'http://via.placeholder.com/600' },
      { id: 'http://via.placeholder.com/600' }
    ]}
    getMediaUrl={a => a.id}
  />
)

defaultStory.story = {
  name: 'default'
}

export const resizer = () => (
  <MediaCarousel
    style={{ width: 600, height: 400 }}
    onClick={action('media click')}
    attachments={Array(9)
      .fill()
      .map((_, i) => ({
        id: `https://lorempixel.com/{size}/{size}/nature/${i}`
      }))}
    getMediaUrl={(a, { width = 200, height = 200 } = {}) =>
      a.id.replace(/\{size\}/g, width + '')
    }
  />
)
