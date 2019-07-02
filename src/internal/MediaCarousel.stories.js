// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import MediaCarousel from './MediaCarousel'
import { ResizerContext } from './Context'
storiesOf('internal/MediaCarousel', module)
  .add('default', () => (
    <MediaCarousel
      style={{ width: 600, height: 400, outline: 'solid 1px blue' }}
      media={[
        { url: 'http://via.placeholder.com/600', type: 'image' },
        { url: 'http://via.placeholder.com/600', type: 'image' },
        { url: 'http://via.placeholder.com/600', type: 'image' }
      ]}
    />
  ))
  .add('resizer', () => (
    <ResizerContext.Provider
      value={(url, size) => url.replace(/\{size\}/g, size + '')}>
      <MediaCarousel
        style={{ width: 600, height: 400 }}
        onClick={action('media click')}
        media={Array(9)
          .fill()
          .map((_, i) => ({
            url: `https://lorempixel.com/{size}/{size}/nature/${i}`,
            type: 'image'
          }))}
      />
    </ResizerContext.Provider>
  ))
