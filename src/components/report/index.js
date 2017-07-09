import PropTypes from 'prop-types'
import React from 'react'
import Paper from 'material-ui/Paper'
import insertCss from 'insert-css'

import FeatureDetail from '../feature_detail'
import * as MFPropTypes from '../../util/prop_types'
import MapView from '../map'
import Alert from './alert'
import config from '../../../config.json'
// import {FIELD_TYPE_DATE} from '../../constants'

insertCss(`
.report_wrapper {
  overflow: scroll;
  position: absolute;
  width: 100%;
  height: 100%;
}
.report_container {
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
  background-color: rgba(236, 236, 236, 1);
  padding: 0 20px
}
.report_paper {
  margin: 20px auto;
  width: 8.5in;
  min-height: 10.5in;
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
}
@page {
  margin: 0.5in;
}
.report_paper:first-child {
  display: flex;
  height: 9.8in;
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
  .outer.container, .inner.container {
    display: block !important;
  }
  /* Fix for page-break-after not working in Chrome see http://stackoverflow.com/questions/4884380/css-page-break-not-working-in-all-browsers/5314590 */
  div {
    float: none !important;
  }
  tr {
    page-break-inside: avoid;
  }
  /* Override fixed positioning of top level div */
  #root .outer.container {
    position: relative !important;
  }
  .report_wrapper {
    position: relative;
    width: auto;
    height: auto;
  }
  .report_container {
    display: block;
    padding: 0;
    overflow: visible;
    background-color: initial;
  }
  .report_paper {
    min-height: auto;
    box-shadow: none !important;
    border-radius: 0 !important;
    margin: 0;
    width: 7.5in;
  }
  .no_print {
    display: none;
  }
  .report_page {
    margin: 0
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

class ReportView extends React.Component {
  static propTypes = {
    filteredFeatures: PropTypes.arrayOf(MFPropTypes.mapViewFeature).isRequired,
    fieldMapping: MFPropTypes.fieldMapping,
    filter: MFPropTypes.mapboxFilter
  }

  render () {
    const { filteredFeatures } = this.props
    const featuresSlice = filteredFeatures.length > 26 ? filteredFeatures.slice(0, 26) : filteredFeatures
    return (
      <div className='report_wrapper'>
        <div className='report_header'>
          {filteredFeatures.length > 26 && <Alert label={'Current filters show ' + filteredFeatures.length +
              ' records, a report will only show the first 26 records'} />}
        </div>
        <div className='report_container'>
          <Paper className='report_paper'>
            <div className='report_page'>
              <h2>Monitoring Report</h2>
              <p style={{marginTop: 0}}>{featuresSlice.length} locations</p>
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
              <Paper className='report_paper' key={i}>
                <div className='report_page'>
                  <FeatureDetail
                    key={i}
                    id={feature.id}
                    label={config.labelChars.charAt(i)}
                    print
                  />
                </div>
                <hr className='page_break' />
              </Paper>
            ))
          }
          {featuresSlice.length > 20 &&
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
