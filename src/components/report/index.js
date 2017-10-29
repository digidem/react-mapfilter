import PropTypes from 'prop-types'
import React from 'react'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import omit from 'lodash/omit'

import ReportFeature from './feature'
import * as MFPropTypes from '../../util/prop_types'
import MapView from '../map'
import Alert from './alert'
import config from '../../../config.json'
// import {FIELD_TYPE_DATE} from '../../constants'

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
  reportContainer: {
    minWidth: '8.5in',
    padding: '0 20px',
    '@media only print': {
      display: 'block',
      padding: 0,
      overflow: 'visible'
    }
  },
  reportPaper: {
    cursor: 'pointer',
    margin: '20px auto',
    width: '8.5in',
    overflow: 'hidden',
    pageBreakAfter: 'always',
    position: 'relative',
    '@media only print': {
      minHeight: 'auto',
      boxShadow: 'none !important',
      borderRadius: '0 !important',
      margin: 0,
      /* for some reason we need to substract 2px for a perfect fit */
      width: 'calc(7.5in - 2px)'
    },
    '&:last-child': {
      pageBreakAfter: 'avoid !important'
    }
  },
  reportPaperMap: {
    cursor: 'auto',
    display: 'flex',
    height: 'calc(11in - 2px)',
    '@media only print': {
      height: 'calc(10in - 2px)'
    }
  },
  mapContainer: {
    flex: 1,
    position: 'relative'
  },
  pageBreak: {
    position: 'absolute',
    left: 0,
    top: '10.5in',
    width: '100%',
    border: 'none',
    margin: 0,
    borderBottom: '3px dashed rgba(200,200,200, 0.75)',
    '@media only print': {
      display: 'none'
    }
  },
  reportPage: {
    margin: '0.5in',
    minHeight: '10in',
    outline: '1px dashed #eeeeee',
    '@media only print': {
      minHeight: 'auto',
      margin: 0,
      outline: 'none'
    }
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

const MAX_REPORT_LEN = 26

class ReportView extends React.Component {
  static propTypes = {
    filteredFeatures: PropTypes.arrayOf(MFPropTypes.mapViewFeature).isRequired,
    fieldMapping: MFPropTypes.fieldMapping,
    filter: MFPropTypes.mapboxFilter
  }

  render () {
    const { filteredFeatures, showFeatureDetail, classes } = this.props
    const featuresSlice = filteredFeatures.length > MAX_REPORT_LEN ? filteredFeatures.slice(0, MAX_REPORT_LEN) : filteredFeatures
    return (
      <div className={classes.reportWrapper}>
        <div className={classes.reportHeader}>
          {filteredFeatures.length > MAX_REPORT_LEN && <Alert label={'Current filters show ' + filteredFeatures.length +
              ' records, a report will only show the first ' + MAX_REPORT_LEN + ' records'} />}
        </div>
        <div className={classes.reportContainer}>
          <Paper className={classes.reportPaper + ' ' + classes.reportPaperMap} elevation={1}>
            <div className={classes.reportPage + ' ' + classes.reportPageMap}>
              <header className={classes.mapHeader}>
                <Typography type='title'>Monitoring Report</Typography>
                <Typography type='subheading' style={{marginBottom: '0.5em'}}>{featuresSlice.length} locations</Typography>
              </header>
              <div className={classes.mapContainer}>
                <MapView
                  {...omit(this.props, 'classes')}
                  features={featuresSlice}
                  interactive={false}
                  labelPoints
                />
              </div>
            </div>
          </Paper>
          {
            featuresSlice.map((feature, i) => (
              <Paper className={classes.reportPaper} key={i} onClick={() => showFeatureDetail(feature.id)} elevation={1}>
                <div className={classes.reportPage}>
                  <ReportFeature
                    {...omit(this.props, 'classes')}
                    feature={feature}
                    label={config.labelChars.charAt(i)}
                  />
                </div>
                <hr className={classes.pageBreak} />
              </Paper>
            ))
          }
          {featuresSlice.length > MAX_REPORT_LEN &&
            <Paper className={classes.reportPaper}>
              <div className={classes.reportPage}>
                <h2>Cannot print more than 26 observations in a single report</h2>
              </div>
            </Paper>
          }
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(ReportView)
