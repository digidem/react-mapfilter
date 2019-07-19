// @flow
import React, { useMemo } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeGrid as Grid } from 'react-window'
import getScrollBarWidth from 'get-scrollbar-width'

import { makeStyles } from '../utils/styles'
import type { Observation } from 'mapeo-schema'

type Attachment = $ElementType<
  $NonMaybeType<$ElementType<Observation, 'attachments'>>,
  number
>

type AttachmentWithObservationId = {
  ...$Exact<Attachment>,
  observationId: $ElementType<Observation, 'id'>
}
const useStyles = makeStyles({
  image: {
    border: '1px solid white',
    boxSizing: 'border-box',
    display: 'block',
    height: '100%',
    objectFit: 'cover',
    width: '100%',
    cursor: 'pointer',
    backgroundColor: 'rgb(240, 240, 240)'
  }
})

type Props = {
  /** Array of image attachments to render. Each attachment should have an id
   * and and observationId, which points to the parent observation */
  images: Array<AttachmentWithObservationId>,
  /** Called with id of observation clicked and id of the attachment clicked */
  onImageClick: (observationId: string, attachmentId?: string) => void,
  /** Should return a url to display the attachment, optionally scaled according
   *  to options.width and options.height */
  getMediaUrl: (
    attachment: Attachment,
    options?: { width: number, height: number }
  ) => string | void,
  /** Optional default size for grid items */
  defaultSize?: number
}

/**
 * Renders a grid of images
 */
const ImageGrid = ({
  images,
  onImageClick,
  getMediaUrl,
  defaultSize = 200
}: Props) => {
  const pixelRatio = window.devicePixelRatio || 1
  const scrollbarWidth = useMemo(() => getScrollBarWidth(), [])
  const classes = useStyles()

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
      <AutoSizer>
        {({ height, width }) => {
          const columnsCount = Math.floor(width / defaultSize)
          const rowsCount = Math.ceil(images.length / columnsCount)
          let cellSize = width / columnsCount
          const overflow = cellSize * rowsCount > height
          if (overflow && scrollbarWidth) {
            cellSize = (width - scrollbarWidth) / columnsCount
          }

          return (
            <Grid
              columnCount={columnsCount}
              columnWidth={cellSize}
              height={height}
              rowCount={rowsCount}
              rowHeight={cellSize}
              width={width}>
              {({
                columnIndex,
                rowIndex,
                style
              }: {
                columnIndex: number,
                rowIndex: number,
                style: {}
              }) => {
                const image = images[rowIndex * columnsCount + columnIndex]
                if (!image) return null
                const imgSize = cellSize * pixelRatio
                const imageUrl = getMediaUrl(image, {
                  width: imgSize,
                  height: imgSize
                })
                return (
                  <img
                    src={imageUrl}
                    className={classes.image}
                    style={style}
                    onClick={() => onImageClick(image.observationId, image.id)}
                  />
                )
              }}
            </Grid>
          )
        }}
      </AutoSizer>
    </div>
  )
}

export default ImageGrid
