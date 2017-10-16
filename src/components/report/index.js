import PropTypes from 'prop-types'
import React from 'react'
import Paper from 'material-ui/Paper'
import insertCss from 'insert-css'
import Typography from 'material-ui/Typography'

import ReportFeature from './feature'
import * as MFPropTypes from '../../util/prop_types'
import MapView from '../map'
import Alert from './alert'
import config from '../../../config.json'
// import {FIELD_TYPE_DATE} from '../../constants'

insertCss(`
.report_header {
  position: relative;
  min-width: calc(8.5in + 40px);
  z-index: 1;
}
.report_wrapper {
  overflow: scroll;
  position: absolute;
  background-color: rgba(236, 236, 236, 1);
  width: 100%;
  height: 100%;
}
.report_container {
  min-width: 8.5in;
  padding: 0 20px
}
.report_paper {
  cursor: pointer;
  margin: 20px auto;
  width: 8.5in;
  overflow: hidden;
  page-break-after: always;
  background-color: initial;
  position: relative;
}
.report_paper:last-child {
  page-break-after: avoid !important;
}
.map_container {
  flex: 1;
  position: relative;
}
.page_break {
  position: absolute;
  left: 0;
  top: 10.5in;
  width: 100%;
  border: none;
  margin: 0;
  border-bottom: 3px dashed rgba(200,200,200, 0.75);
}

.report_page {
  margin: 0.5in;
  min-height: 10in;
  outline: 1px dashed #eeeeee;
}
@page {
  margin: 0.5in;
}
.report_paper:first-child {
  cursor: auto;
  display: flex;
  height: calc(11in - 2px);
}
.report_paper:first-child .report_page {
  flex: 1;
  display: flex;
  flex-direction: column;
}
@media only print {
  body, html {
    overflow: visible;
  }
  /* Override display: flex which breaks page-break-after */
  /* Fix for page-break-after not working in Chrome see http://stackoverflow.com/questions/4884380/css-page-break-not-working-in-all-browsers/5314590 */
  div {
    float: none !important;
  }
  tr {
    page-break-inside: avoid;
  }
  .report_wrapper {
    position: relative;
    width: auto;
    height: auto;
    background-color: initial;
  }
  .report_container {
    display: block;
    padding: 0;
    overflow: visible;
  }
  .report_paper {
    min-height: auto;
    box-shadow: none !important;
    border-radius: 0 !important;
    margin: 0;
    /* for some reason we need to substract 2px for a perfect fit */
    width: calc(7.5in - 2px);
  }
  .report_paper:first-child {
    height: calc(10in - 2px);
  }
  .no_print {
    display: none;
  }
  .report_page {
    min-height: auto;
    margin: 0;
    outline: none;
  }
  /* TODO include some form of MapFilter header */
  /* TODO rotate the filter display and show state vs. allow interaction */
  .mapboxgl-control-container,
  .nav.container,
  .page_break,
  .report_header,
  .filter {
    display: none !important;
  }
}
`)

const MAX_REPORT_LEN = 26

class ReportView extends React.Component {
  static propTypes = {
    filteredFeatures: PropTypes.arrayOf(MFPropTypes.mapViewFeature).isRequired,
    fieldMapping: MFPropTypes.fieldMapping,
    filter: MFPropTypes.mapboxFilter
  }

  render () {
    const { filteredFeatures, showFeatureDetail } = this.props
    const featuresSlice = filteredFeatures.length > MAX_REPORT_LEN ? filteredFeatures.slice(0, MAX_REPORT_LEN) : filteredFeatures
    return (
      <div className='report_wrapper'>
        <div className='report_header'>
          {filteredFeatures.length > MAX_REPORT_LEN && <Alert label={'Current filters show ' + filteredFeatures.length +
              ' records, a report will only show the first ' + MAX_REPORT_LEN + ' records'} />}
        </div>
        <div className='report_container'>
          <Paper className='report_paper' elevation={1}>
            <div className='report_page'>
              <header className='map_header'>
                <Typography type='title'>Monitoring Report</Typography>
                <Typography type='subheading' style={{marginBottom: '0.5em'}}>{featuresSlice.length} locations</Typography>
              </header>
              <div className='map_container'>
                <MapView
                  {...this.props}
                  features={featuresSlice}
                  interactive={false}
                  labelPoints
                />
              </div>
            </div>
          </Paper>
          {
            featuresSlice.map((feature, i) => (
              <Paper className='report_paper' key={i} onClick={() => showFeatureDetail(feature.id)} elevation={1}>
                <div className='report_page'>
                  <ReportFeature
                    {...this.props}
                    feature={feature}
                    label={config.labelChars.charAt(i)}
                  />
                </div>
                <hr className='page_break' />
              </Paper>
            ))
          }
          {featuresSlice.length > MAX_REPORT_LEN &&
            <Paper className='report_paper'>
              <div className='report_page'>
                <h2>Cannot print more than 26 observations in a single report</h2>
              </div>
            </Paper>
          }
        </div>
      </div>
    )
  }
}

export default ReportView
