// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import assign from 'object-assign'
import insertCss from 'insert-css'
import {
  AutoSizer,
  List,
  CellMeasurer,
  CellMeasurerCache
} from 'react-virtualized'

// import ReportFeature from './ReportFeature'
import ReportPage from './ReportPage'
import PrintButton from './PrintButton'
import Toolbar from '../internal/Toolbar'
import createAction from '../utils/create_action'

import type { Feature, PaperSize } from '../types'

const isDev = process.env.NODE_ENV !== 'production'

const styles = {
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
      minWidth: '8.5in'
    }
  },
  a4: {
    '&$reportWrapper': {
      minWidth: '210mm'
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
  placeholder: {
    position: 'relative',
    height: '100mm',
    width: '100%',
    border: '1px dotted blue',
    boxSizing: 'border-box',
    backgroundColor: 'beige'
  },
  placeholderMap: {
    width: '100%',
    border: '1px dotted blue',
    boxSizing: 'border-box',
    backgroundColor: 'aqua',
    height: '100%',
    position: 'absolute'
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
}

const VIEW_ID = 'report'
// const LABEL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

type Props = {
  features: Array<Feature>,
  fieldTypes: {
    [fieldName: string]: string
  },
  filter?: Array<any>,
  renderTest: boolean,
  onClickFeature: (featureId: string) => void,
  classes: { [className: $Keys<typeof styles>]: string }
}

type State = {
  hiddenFields: { [fieldName: string]: boolean },
  paperSize: PaperSize,
  print: boolean
}

export const showAllFields = createAction(
  (state: State, props: Props): $Shape<State> => ({ hiddenFields: {} })
)

export const hideAllFields = createAction(
  (state: State, props: Props): $Shape<State> => {
    const hiddenFields = {}
    Object.keys(props.fieldTypes).forEach(key => {
      hiddenFields[key] = true
    })
    return { hiddenFields }
  }
)

export function toggleFieldVisibility(fieldname: string) {
  return createAction(
    (state: State, props: Props): $Shape<State> => {
      const hiddenFields = assign({}, state.hiddenFields, {
        [fieldname]: !state.hiddenFields[fieldname]
      })
      return { hiddenFields }
    }
  )
}

export const requestPrint = createAction(
  (state: State, props: Props): $Shape<State> => ({ print: true })
)

class ReportView extends React.Component<Props, State> {
  static id = VIEW_ID

  static defaultProps = {
    fieldTypes: {},
    features: [],
    onClickFeature: () => null,
    renderTest: false
  }

  cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 11 * 72,
    // Avoid invalidating the cache when the feature filter changes
    keyMapper: (rowIndex: number) =>
      this.props.features[rowIndex].id +
      // Hidden fields affects height, so the key must change if these change
      Object.keys(this.state.hiddenFields)
        .filter(f => this.state.hiddenFields[f])
        .sort()
        .join(',')
  })

  state = {
    hiddenFields: {},
    paperSize: 'a4',
    print: false
  }

  handleOnShowAll = () => this.setState(showAllFields)

  handleOnHideAll = () => this.setState(hideAllFields)

  handleRequestPrint = () => this.setState(requestPrint)

  handleChangePaperSize = (paperSize: PaperSize) => this.setState({ paperSize })

  handleFieldVisibilityToggle = fieldname =>
    this.setState(toggleFieldVisibility(fieldname))

  componentDidMount() {
    const { paperSize } = this.state
    insertCss(`@page {margin: 0.5in; size: ${paperSize};}`)
  }

  componentDidUpdate(_, prevState) {
    const { paperSize, print } = this.state
    if (prevState.paperSize !== paperSize) {
      // TODO: This will continue to grow the CSS, but probably fine.
      insertCss(`@page {margin: 0.5in; size: ${paperSize};}`)
    }
    if (print) {
      window.print()
      this.setState({ print: false })
    }
  }

  renderPage = ({ index, key, style, parent }) => (
    <CellMeasurer
      cache={this.cache}
      columnIndex={0}
      key={key}
      parent={parent}
      rowIndex={index}>
      {index === 0
        ? this.renderMapPage({ index, key, style })
        : this.renderFeaturePage({ index, key, style })}
    </CellMeasurer>
  )

  renderMapPage({ key, style }: { key?: string, style?: Object } = {}) {
    const { classes, renderTest } = this.props
    const { paperSize } = this.state
    style = { ...style, width: 'auto' }

    // For dev and testing we render placeholders, removed in production
    if (renderTest && isDev) {
      return (
        <ReportPage key={key} style={style} fixedHeight paperSize={paperSize}>
          <div className={classes.placeholderMap} />
        </ReportPage>
      )
    }

    return null
  }

  renderFeaturePage({
    index,
    key,
    style
  }: {
    index: number,
    key?: string,
    style?: Object
  }) {
    const { classes, features, onClickFeature, renderTest } = this.props
    const { paperSize } = this.state
    style = { ...style, width: 'auto' }

    // For dev and testing we render placeholders, removed in production
    if (renderTest && isDev) {
      return (
        <ReportPage
          key={key}
          style={style}
          onClick={() => onClickFeature(features[index].id)}
          paperSize={paperSize}>
          <div
            style={
              // $FlowFixMe
              { height: features[index].properties.height + 'mm' }
            }
            className={classes.placeholder}
          />
        </ReportPage>
      )
    }

    return null
  }

  renderVirtualList() {
    const { features, classes } = this.props
    const { paperSize } = this.state
    return (
      <AutoSizer>
        {({ height, width }) => (
          <List
            className={classes.reportWrapper + ' ' + classes[paperSize]}
            containerStyle={{ overflowX: 'scroll' }}
            height={height}
            width={width}
            rowCount={features.length}
            rowRenderer={this.renderPage}
            deferredMeasurementCache={this.cache}
            rowHeight={this.cache.rowHeight}
            overscanRowCount={1}
            estimatedRowSize={11 * 72}
          />
        )}
      </AutoSizer>
    )
  }

  renderPrintList() {
    const { features } = this.props
    return (
      <React.Fragment>
        {this.renderMapPage()}
        {features.map((feature, index) =>
          this.renderFeaturePage({ index, key: feature.id })
        )}
      </React.Fragment>
    )
  }

  render() {
    const { classes } = this.props
    const { paperSize, print } = this.state

    return (
      <div className={classes.root}>
        <Toolbar>
          <PrintButton
            requestPrint={this.handleRequestPrint}
            changePaperSize={this.handleChangePaperSize}
            paperSize={paperSize}
          />
        </Toolbar>
        <div className={classes.scrollWrapper}>
          {print ? this.renderPrintList() : this.renderVirtualList()}
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(ReportView)
