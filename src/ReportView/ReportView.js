// @flow
import React, { useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import {
  AutoSizer,
  List,
  CellMeasurer,
  CellMeasurerCache
} from 'react-virtualized'
import type { Observation } from 'mapeo-schema'

// import ReportFeature from './ReportFeature'
import ReportPageContent from './ReportPageContent'
import ReportPaper from './ReportPaper'
import MapView from '../MapView'
import { cm, inch } from '../utils/dom'
import { getLastImage } from '../utils/helpers'
import { getFields as defaultGetFieldsFromTags } from '../lib/data_analysis'

import type {
  PaperSize,
  GetMediaUrl,
  PresetWithFields,
  CameraOptions
} from '../types'

const BORDER_SIZE = 0.5 * inch()

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(236, 236, 236, 1)',
    '@media only print': {
      width: 'auto',
      height: 'auto',
      position: 'static',
      backgroundColor: 'inherit',
      display: 'block'
    }
  },
  reportWrapper: {
    '@media only print': {
      padding: 0,
      minWidth: 'auto'
    }
  },
  paperContentMap: {
    display: 'flex'
  },
  letter: {
    '&$reportWrapper': {
      minWidth: 8.5 * inch()
    }
  },
  a4: {
    '&$reportWrapper': {
      minWidth: 21 * cm()
    }
  },
  scrollWrapper: {
    flex: '1 1 auto',
    overflow: 'scroll',
    '@media only print': {
      overflow: 'auto',
      flex: 'initial',
      position: 'static'
    }
  },
  '@global': {
    '@media only print': {
      tr: {
        pageBreakInside: 'avoid'
      },
      '.d-print-none': {
        display: 'none'
      },
      '.mapboxgl-ctrl-group, .mapboxgl-ctrl-attrib': {
        display: 'none'
      }
    }
  }
})

// const TABLE_WIDTHS = {
//   a4: 21 * cm() - 2 * BORDER_SIZE,
//   letter: 8.5 * inch() - 2 * BORDER_SIZE
// }

// const LABEL_CHARS =
// 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

type Props = {
  /** Array of observations to render */
  observations: Array<Observation>,
  /** Called with id of observation clicked */
  onClick?: (id: string) => void,
  /** Called with
   * [CameraOptions](https://docs.mapbox.com/mapbox-gl-js/api/#cameraoptions)
   * with properties `center`, `zoom`, `bearing`, `pitch` */
  onMapMove?: CameraOptions => any,
  /** Initial position of the map - an object with properties `center`, `zoom`,
   * `bearing`, `pitch`. If this is not set then the map will by default zoom to
   * the bounds of the observations. If you are going to unmount and re-mount
   * this component (e.g. within tabs) then you will want to use onMove to store
   * the position in state, and pass it as initialPosition for when the map
   * re-mounts. */
  initialMapPosition?: $Shape<CameraOptions>,
  /** A function called with an observation that should return a matching preset
   * with field definitions */
  getPreset?: Observation => ?PresetWithFields,
  /** A function called with an observation attachment that should return a URL
   * to retrieve the attachment. If called with `options.width` and
   * `options.height`, the function should return a URL to a resized image, if
   * available */
  getMediaUrl: GetMediaUrl,
  /** Paper size for report */
  paperSize?: PaperSize,
  /** Render for printing (for screen display only visible observations are
   * rendered, for performance reasons) */
  print?: boolean,
  /** Mapbox access token */
  mapboxAccessToken: string
}

const ReportView = ({
  observations,
  onClick = () => {},
  onMapMove,
  initialMapPosition,
  getPreset,
  getMediaUrl,
  paperSize = 'a4',
  print = false,
  mapboxAccessToken
}: Props) => {
  const classes = useStyles()
  const [mapPosition, setMapPosition] = useState()

  const fallbackGetPreset = useCallback(
    (observation: Observation) => {
      if (getPreset) return getPreset(observation)
      return {
        id: observation.id,
        name: 'Observation',
        geometry: ['point'],
        tags: {},
        fields: defaultGetFieldsFromTags(observation.tags)
      }
    },
    [getPreset]
  )

  const cacheRef = React.useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      minHeight: 200
    })
  )
  const cache = cacheRef.current

  const paperWidthPx = paperSize === 'a4' ? 21 * cm() : 8.5 * inch()

  function getLastImageUrl(observation: Observation): string | void {
    const lastImageAttachment = getLastImage(observation)
    if (!lastImageAttachment) return
    return getMediaUrl(lastImageAttachment, {
      width: paperWidthPx - 2 * BORDER_SIZE,
      height: paperWidthPx - 2 * BORDER_SIZE
    })
  }

  function renderPage({ index, key, style, parent }) {
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}>
        <div style={style}>
          {index === 0
            ? renderMapPage({ index, key })
            : renderFeaturePage({ index: index - 1, key })}
        </div>
      </CellMeasurer>
    )
  }

  function renderMapPage({ key }: { key?: string } = {}) {
    return (
      <ReportPaper
        key={key}
        paperSize={paperSize}
        classes={{ content: classes.paperContentMap }}>
        <MapView
          observations={observations}
          getMediaUrl={getMediaUrl}
          initialMapPosition={initialMapPosition || mapPosition}
          onMapMove={onMapMove || setMapPosition}
          mapboxAccessToken={mapboxAccessToken}
          print
        />
      </ReportPaper>
    )
  }

  function renderFeaturePage({ index, key }: { index: number, key?: string }) {
    const observation = observations[index]
    const coords =
      typeof observation.lon === 'number' && typeof observation.lat === 'number'
        ? {
            longitude: observation.lon,
            latitude: observation.lat
          }
        : undefined
    const createdAt =
      typeof observation.created_at === 'string'
        ? new Date(observation.created_at)
        : undefined
    const preset = fallbackGetPreset(observation) || {}
    const fields = preset.fields
    const name = preset.name || 'Observation'
    return (
      <ReportPaper
        key={key}
        paperSize={paperSize}
        onClick={() => onClick(observation.id)}>
        <ReportPageContent
          name={name}
          createdAt={createdAt}
          coords={coords}
          fields={fields}
          imageSrc={getLastImageUrl(observation)}
          tags={observation.tags}
          paperSize={paperSize}
        />
      </ReportPaper>
    )
  }

  function renderVirtualList() {
    return (
      <AutoSizer>
        {({ height, width }) => (
          <List
            className={classes.reportWrapper + ' ' + classes[paperSize]}
            containerStyle={{ overflowX: 'scroll' }}
            height={height}
            width={width}
            rowCount={observations.length + 1 /* for additional map page */}
            rowRenderer={renderPage}
            deferredMeasurementCache={cache}
            rowHeight={cache.rowHeight}
            overscanRowCount={3}
            estimatedRowSize={
              200 /* paperSize === 'a4' ? 29.7 * cm() : 11 * inch()} */
            }
          />
        )}
      </AutoSizer>
    )
  }

  function renderPrintList() {
    return (
      <React.Fragment>
        {renderMapPage()}
        {observations.map((_, index) =>
          renderFeaturePage({ index, key: index + '' })
        )}
      </React.Fragment>
    )
  }

  return (
    <div className={classes.root}>
      <div className={classes.scrollWrapper}>
        {print ? renderPrintList() : renderVirtualList()}
      </div>
    </div>
  )
}

export default ReportView
