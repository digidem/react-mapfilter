// @flow

import PropTypes from 'prop-types'
import React from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import PrintIcon from '@material-ui/icons/Print'
import omit from 'lodash/omit'
import assign from 'object-assign'

import ReportFeature from './ReportFeature'
import ReportPage from './ReportPage'
import Toolbar, { ToolbarButton } from '../Toolbar'
import createAction from '../utils/create_action'

import type { Feature } from '../../lib/types'

const styles = {
  reportHeader: {
    position: 'relative',
    minWidth: 'calc(8.5in + 40px)',
    zIndex: 1,
    '@media only print': {
      display: 'none'
    }
  },
  reportWrapper: {
    overflow: 'scroll',
    position: 'absolute',
    backgroundColor: 'rgba(236, 236, 236, 1)',
    width: '100%',
    height: '100%',
    '@media only print': {
      position: 'relative',
      width: 'auto',
      height: 'auto',
      backgroundColor: 'initial'
    }
  },
  letter: {
    '& $reportContainer': {
      minWidth: '8.5in'
    },
    '& $reportPaperMap': {
      height: 'calc(11in - 2px)',
      '@media only print': {
        height: 'calc(10in - 2px)'
      }
    }
  },
  a4: {
    '& $reportContainer': {
      minWidth: '210mm'
    },
    '& $reportPaperMap': {
      height: 'calc(297mm - 3px)',
      '@media only print': {
        height: 'calc(297mm - 1in - 3px)'
      }
    }
  },
  reportContainer: {
    padding: '0 20px',
    '@media only print': {
      display: 'block',
      padding: 0,
      overflow: 'visible'
    }
  },
  reportPaperMap: {
    cursor: 'auto',
    display: 'flex'
  },
  mapContainer: {
    flex: 1,
    position: 'relative'
  },
  reportPageMap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  '@global': {
    '@media only print': {
      tr: {
        pageBreakInside: 'avoid'
      }
    }
  }
}

const VIEW_ID = 'report'
const LABEL_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

type Props = {
  features: Array<Feature>,
  fieldTypes: {
    [fieldName: string]: string
  },
  filter?: Array<any>,
  onClickFeature: (featureId: string) => void,
  classes: { [className: $Keys<typeof styles>]: string }
}

type State = {
  hiddenFields: { [fieldName: string]: boolean },
  paperSize: 'a4' | 'letter',
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
    fieldTypes: {}
  }

  state = {
    hiddenFields: {},
    paperSize: 'a4',
    print: false
  }

  handleOnShowAll = () => this.setState(showAllFields)

  handleOnHideAll = () => this.setState(hideAllFields)

  handleFieldVisibilityToggle = fieldname =>
    this.setState(toggleFieldVisibility(fieldname))

  render() {
    const { features, classes, onClickFeature } = this.props
    const { paperSize, hiddenFields } = this.state

    return (
      <div>
        <Toolbar>
          <ToolbarButton onClick={requestPrint}>
            <PrintIcon />
            Print
          </ToolbarButton>
        </Toolbar>
        <div className={classes.reportWrapper + ' ' + classes[paperSize]}>
          <div className={classes.reportContainer}>
            <ReportPage>
              <header className={classes.mapHeader}>
                <Typography type="title">Monitoring Report</Typography>
                <Typography type="subheading" style={{ marginBottom: '0.5em' }}>
                  {featuresSlice.length} locations
                </Typography>
              </header>
              <div className={classes.mapContainer}>
                <MapView
                  {...omit(this.props, 'classes')}
                  features={featuresSlice}
                  interactive={false}
                  labelPoints
                />
              </div>
            </ReportPage>
            {features.map((feature, i) => (
              <ReportPage
                key={feature.id}
                onClick={() => onClickFeature(feature.id)}
                paperSize={paperSize}>
                <ReportFeature
                  hiddenFields={hiddenFields}
                  feature={feature}
                  label={LABEL_CHARS.charAt(i)}
                />
              </ReportPage>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(ReportView)
