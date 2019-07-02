// @flow
import React from 'react'
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
import { cm, inch } from '../utils/dom'
import { getFields as defaultGetFieldsFromTags } from '../lib/data_analysis'

import type { Field, PaperSize } from '../types'

// const BORDER_SIZE = 0.5 * inch()

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

function defaultGetFields(obs: Observation) {
  return defaultGetFieldsFromTags(obs.tags)
}

type Props = {
  /** Array of observations to render */
  observations: Array<Observation>,
  /** Called with id of observation clicked */
  onClick?: (id: string) => void,
  /** Get an array of fields to render for an observation - defaults to
   * automatically determining fields */
  getFields?: (observation: Observation) => Array<Field>,
  /** Get the name of an observation (rendered as the page title). defaults to
   * 'Observation' */
  getName?: (observation: Observation) => string,
  /** If you want an image to appear for each observation, pass a function that
   * returns a URL for the image to display. */
  getImageSrc?: (observation: Observation) => string | void,
  /** Paper size for report */
  paperSize?: PaperSize,
  /** Render for printing (for screen display only visible observations are
   * rendered, for performance reasons) */
  print?: boolean
}

const ReportView = ({
  observations,
  onClick = () => {},
  getFields = defaultGetFields,
  getName = () => 'Observation',
  getImageSrc = () => {},
  paperSize = 'a4',
  print = false
}: Props) => {
  const classes = useStyles()

  const cacheRef = React.useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      minHeight: 200
    })
  )
  const cache = cacheRef.current

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
      <ReportPaper key={key} paperSize={paperSize}>
        <div />
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
    const fields = getFields(observation)
    const name = getName(observation)
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
          imageSrc={getImageSrc(observation)}
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
