// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import ImageGrid from './ImageGrid'

storiesOf('MediaView/ImageGrid', module).add('default', () => {
  function getMediaUrl({ id }, { width = 200, height = 200 } = {}) {
    const size = Math.floor(width / 100) * 100
    return `https://picsum.photos/id/${+id % 80}/${size}/${size}`
  }
  const images = Array(500)
    .fill()
    .map((_, i) => ({ id: i + '', observationId: 'obs' + Math.floor(i / 5) }))
  return (
    <ImageGrid
      images={images}
      onImageClick={action('click')}
      getMediaUrl={getMediaUrl}
    />
  )
})
