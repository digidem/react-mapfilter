// @flow
import React, { useMemo } from 'react'
import mime from 'mime/lite'

import ImageGrid from './ImageGrid'
import type { Observation } from 'mapeo-schema'

type Attachment = $ElementType<
  $NonMaybeType<$ElementType<Observation, 'attachments'>>,
  number
>

type AttachmentWithObservationId = {
  ...$Exact<Attachment>,
  observationId: $ElementType<Observation, 'id'>
}

type Props = {
  /** Array of observations to render */
  observations: Array<Observation>,
  /** Called with id of observation clicked */
  onClick: (observationId: string, attachmentId?: string) => void,
  /** Should return a url to display the attachment, optionally scaled according
   *  to options.width and options.height */
  getMediaUrl: (
    attachment: Attachment,
    options?: { width: number, height: number }
  ) => string | void
}

const MediaView = ({ observations, onClick, getMediaUrl }: Props) => {
  const images = useMemo(
    function getImageAttachments(): Array<AttachmentWithObservationId> {
      const images = []
      for (const obs of observations) {
        for (const attachment of obs.attachments || []) {
          const mimeType = attachment.type || mime.getType(attachment.id)
          // Only return attachments with images, and check we can actually get
          // an image src for each one before adding it
          if (
            mimeType &&
            mimeType.split('/')[0] === 'image' &&
            getMediaUrl(attachment)
          )
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
