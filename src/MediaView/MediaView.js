// @flow
import React, { useMemo } from 'react'

import ImageGrid from './ImageGrid'
import { isImageAttachment } from '../utils/helpers'
import type { Observation } from 'mapeo-schema'
import type { Attachment } from '../types'

type AttachmentWithObservationId = {
  ...$Exact<Attachment>,
  observationId: $ElementType<Observation, 'id'>
}

type Props = {
  /** Array of observations to render */
  observations: Array<Observation>,
  /** Called with id of observation clicked */
  onClick: (observationId: string, attachmentId?: string) => void,
  /** A function called with an observation attachment that should return a URL
   * to retrieve the attachment. If called with `options.width` and
   * `options.height`, the function should return a URL to a resized image, if
   * available */
  getMediaUrl: (
    attachment: Attachment,
    options?: { width: number, height: number }
  ) => string | void
}

/**
 * Displays a grid of all photos attached to observations.
 */
const MediaView = ({ observations, onClick, getMediaUrl }: Props) => {
  const images = useMemo(
    function getImageAttachments(): Array<AttachmentWithObservationId> {
      const images = []
      for (const obs of observations) {
        for (const attachment of obs.attachments || []) {
          // Only return attachments with images, and check we can actually get
          // an image src for each one before adding it
          if (isImageAttachment(attachment) && getMediaUrl(attachment))
            images.push({ ...attachment, observationId: obs.id })
        }
      }
      return images
    },
    [observations, getMediaUrl]
  )

  return (
    <ImageGrid
      images={images}
      getMediaUrl={getMediaUrl}
      onImageClick={onClick}
    />
  )
}

export default MediaView
