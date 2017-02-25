import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import insertCss from 'insert-css'

import FeatureDetail from '../components/feature_detail'
import * as MFPropTypes from '../util/prop_types'
import MapView from '../components/map_view'
import Alert from '../components/alert'
import getFieldMapping from '../selectors/field_mapping'
import getFilteredFeatures from '../selectors/filtered_features'
import getMapboxFilter from '../selectors/mapbox_filter'
import getMapGeoJSON from '../selectors/map_geojson'

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
  min-height: 11in;
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
  top: 11in;
  width: 100%;
  border: none;
  margin: 0;
  border-bottom: 3px dashed rgba(200,200,200, 0.75);
}
.report_page {
  margin: 0.5in 0.5in 0.5in 0.5in;
}
.report_paper:first-child {
  display: flex;
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
  #root > div {
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
    box-shadow: none !important;
    border-radius: 0 !important;
    margin: 0;
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

class ReportContainer extends React.Component {
  static propTypes = {
    features: PropTypes.array.isRequired,
    fieldMapping: MFPropTypes.fieldMapping,
    filter: MFPropTypes.mapboxFilter,
    geojson: PropTypes.shape({
      type: PropTypes.oneOf(['FeatureCollection']).isRequired,
      features: PropTypes.arrayOf(MFPropTypes.mapViewFeature).isRequired
    }).isRequired
  }

  render () {
    const { features } = this.props
    const featuresSlice = features.length > 26 ? features.slice(0, 26) : features

    return (
      <div className='report_wrapper'>
        <div className='report_header'>
          {features.length > 26 && <Alert label={'Current filters show ' + features.length +
              ' records, a report will only show the first 26 records'} />}
        </div>
        <div className='report_container'>
          <Paper className='report_paper'>
            <div className='report_page'>
              <h2>{featuresSlice.length} Observations</h2>
              <div className='map_container'>
                <MapView
                  {...this.props}
                  interactive={false}
                  labelPoints
                />
              </div>
            </div>
          </Paper>
          {
            featuresSlice.map((feature, id) => (
              <Paper className='report_paper' key={id}>
                <div className='report_page'>
                  <FeatureDetail
                    key={id}
                    id={feature.id}
                    label={feature.properties.__mf_label}
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

function mapStateToProps (state) {
  return {
    features: getFilteredFeatures(state),
    fieldMapping: getFieldMapping(state),
    filter: getMapboxFilter(state),
    geojson: getMapGeoJSON(state)
  }
}

export default connect(
  mapStateToProps
)(ReportContainer)
