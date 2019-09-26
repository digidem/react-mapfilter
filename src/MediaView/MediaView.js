// @flow
import React, { useMemo } from 'react'

import ImageGrid from './ImageGrid'
import { isImageAttachment } from '../utils/helpers'
import type { Observation } from 'mapeo-schema'
import type { GetMedia } from '../types'

type Props = {
  /** Array of observations to render */
  observations: Array<Observation>,
  /** Called with id of observation clicked */
  onClick: (observationId: string, index?: number) => void,
  /** A function called with an observation attachment that should return a URL
   * to retrieve the attachment. If called with `options.width` and
   * `options.height`, the function should return a URL to a resized image, if
   * available */
  getMedia: GetMedia
}

/**
 * Displays a grid of all photos attached to observations.
 */
const MediaView = ({ observations, onClick, getMedia }: Props) => {
  const images = useMemo(() => {
    const images = []
    for (const obs of observations) {
      const attachments = obs.attachments || []
      for (let i = 0; i < attachments.length; i++) {
        // Only return attachments with images
        if (!isImageAttachment(attachments[i])) continue
        // check we can actually get an image src for each one before adding it
        const media = getMedia(attachments[i], { width: 200, height: 200 })
        if (media)
          images.push({
            index: i,
            src: media.src,
            observationId: obs.id
          })
      }
    }
    return images
  }, [observations, getMedia])

  return <ImageGrid images={images} onImageClick={onClick} />
}

export default MediaView
