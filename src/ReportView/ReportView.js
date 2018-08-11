// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import insertCss from 'insert-css'
import memoizeOne from 'memoize-one'
import {
  AutoSizer,
  List,
  CellMeasurer,
  CellMeasurerCache
} from 'react-virtualized'

// import ReportFeature from './ReportFeature'
import ReportPage from './ReportPage'
import HideFieldsButton from './HideFieldsButton'
import PrintButton from './PrintButton'
import Toolbar from '../internal/Toolbar'
import FeatureTable from '../internal/FeatureTable'
import createAction from '../utils/create_action'
import { flattenFeature, filterFeatures } from '../utils/features'

import type {
  PointFeature,
  Filter,
  FieldTypes,
  FieldState,
  PaperSize
} from '../types'

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

const TABLE_WIDTHS = {
  a4: 'calc(210mm - 1in)',
  letter: 'calc(8.5in - 1in)'
}

const VIEW_ID = 'report'
// const LABEL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

type Props = {
  features: Array<PointFeature>,
  fieldTypes: FieldTypes,
  filter: Filter,
  renderTest: boolean,
  onClickFeature: (feature: PointFeature) => void,
  classes: { [className: $Keys<typeof styles>]: string }
}

type State = {
  hiddenFields: Array<string>,
  paperSize: PaperSize,
  print: boolean
}

export const showAllFields = createAction(
  (state: State, props: Props): $Shape<State> => ({ hiddenFields: [] })
)

export const hideAllFields = (allFieldkeys: Array<string>) =>
  createAction(
    (state: State, props: Props): $Shape<State> => ({
      hiddenFields: allFieldkeys
    })
  )

export const toggleFieldVisibility = (fieldkey: string) =>
  createAction(
    (state: State, props: Props): $Shape<State> => {
      // NB: Must not mutate hiddenFields or memoize functions will not work
      const { hiddenFields } = state
      const idx = hiddenFields.indexOf(fieldkey)
      if (idx > -1) {
        return {
          hiddenFields: hiddenFields
            .slice(0, idx)
            .concat(hiddenFields.slice(idx + 1))
        }
      } else {
        return { hiddenFields: hiddenFields.concat([fieldkey]) }
      }
    }
  )

export const requestPrint = createAction(
  (state: State, props: Props): $Shape<State> => ({ print: true })
)

const getAllFieldkeys = (features: Array<PointFeature>): Array<string> => {
  const fields = {}
  features.map(flattenFeature).forEach(f => {
    Object.keys(f.properties || {}).forEach(key => (fields[key] = true))
  })
  return Object.keys(fields)
}

// A memoized function that returns an object with the union of all field keys
// accross all features, with whether fields are hidden or visible
export const getFieldState: (
  fieldkeys: Array<string>,
  hiddenFields: Array<string>
) => FieldState = (fieldkeys, hiddenFields) => {
  const fieldState = {}
  fieldkeys.forEach(
    key => (fieldState[key] = hiddenFields.includes(key) ? 'hidden' : 'visible')
  )
  return fieldState
}

class ReportView extends React.Component<Props, State> {
  static id = VIEW_ID

  static defaultProps = {
    fieldTypes: {},
    features: [],
    filter: [],
    onClickFeature: () => null,
    renderTest: false
  }

  getAllFieldkeys = memoizeOne(getAllFieldkeys)

  getFieldState = memoizeOne(getFieldState)

  filterFeatures = memoizeOne(filterFeatures)

  cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 11 * 72
  })

  state = {
    hiddenFields: [],
    paperSize: 'a4',
    print: false
  }

  handleShowAll = () => this.setState(showAllFields)

  handleHideAll = () =>
    this.setState(hideAllFields(this.getAllFieldkeys(this.props.features)))

  handleRequestPrint = () => this.setState(requestPrint)

  handleChangePaperSize = (paperSize: PaperSize) => this.setState({ paperSize })

  handleToggleFieldVisibility = fieldkey =>
    this.setState(toggleFieldVisibility(fieldkey))

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
      // this.setState({ print: false })
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
        : this.renderFeaturePage({ index: index - 1, key, style })}
    </CellMeasurer>
  )

  renderMapPage({ key, style }: { key?: string, style?: Object } = {}) {
    const { classes, renderTest } = this.props
    // const filteredFeatures = this.filterFeatures(features, filter)
    const { paperSize } = this.state
    style = { ...style, width: 'auto' }

    // For dev and testing we render placeholders, removed in production
    if (true || (renderTest && isDev)) {
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
    const { classes, features, filter, onClickFeature, renderTest } = this.props
    const filteredFeatures = this.filterFeatures(features, filter)
    const { paperSize } = this.state
    style = { ...style, width: 'auto' }
    // For dev and testing we render placeholders, removed in production
    if (renderTest && isDev) {
      return (
        <ReportPage
          key={key}
          style={style}
          onClick={() => onClickFeature(filteredFeatures[index])}
          paperSize={paperSize}>
          <div
            style={
              // $FlowFixMe
              { height: (filteredFeatures[index].height || 200) + 'mm' }
            }
            className={classes.placeholder}
          />
        </ReportPage>
      )
    }

    return (
      <ReportPage
        key={key}
        style={style}
        onClick={() => onClickFeature(filteredFeatures[index])}
        paperSize={paperSize}>
        <FeatureTable
          feature={filteredFeatures[index]}
          hiddenFields={this.state.hiddenFields}
          width={TABLE_WIDTHS[paperSize]}
        />
      </ReportPage>
    )
  }

  renderVirtualList() {
    const { classes, features, filter } = this.props
    const filteredFeatures = this.filterFeatures(features, filter)
    const { paperSize } = this.state
    return (
      <AutoSizer>
        {({ height, width }) => (
          <List
            className={classes.reportWrapper + ' ' + classes[paperSize]}
            containerStyle={{ overflowX: 'scroll' }}
            height={height}
            width={width}
            rowCount={filteredFeatures.length + 1 /* for additional map page */}
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
    const { features, filter } = this.props
    const filteredFeatures = this.filterFeatures(features, filter)
    return (
      <React.Fragment>
        {this.renderMapPage()}
        {filteredFeatures.map((feature, index) =>
          this.renderFeaturePage({ index, key: index + '' })
        )}
      </React.Fragment>
    )
  }

  render() {
    const { classes, features } = this.props
    const { paperSize, print, hiddenFields } = this.state
    const fieldState = this.getFieldState(
      this.getAllFieldkeys(features),
      hiddenFields
    )
    return (
      <div className={classes.root}>
        <Toolbar>
          {!!Object.keys(fieldState).length && (
            <HideFieldsButton
              fieldState={fieldState}
              toggleFieldVisibility={this.handleToggleFieldVisibility}
              showAllFields={this.handleShowAll}
              hideAllFields={this.handleHideAll}
            />
          )}
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
