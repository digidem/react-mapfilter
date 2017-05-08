import React from 'react'
import { connect } from 'react-redux'
import omit from 'lodash/omit'
import { bindActionCreators } from 'redux'

import * as actionCreators from '../action_creators'

import getFieldAnalysis from '../selectors/field_analysis'
import getFilterableFeatures from '../selectors/filterable_features'
import getFilteredFeatures from '../selectors/filtered_features'
import getMapBoxFilter from '../selectors/mapbox_filter'
import getFieldMapping from '../selectors/field_mapping'
import getColorIndex from '../selectors/color_index'

const ViewContainer = (props) => React.createElement(props.component, omit(props, 'component'))

function mapStateToProps (state) {
  return {
    center: state.mapPosition.center,
    zoom: state.mapPosition.zoom,
    mapStyle: state.mapStyle,
    features: getFilterableFeatures(state),
    fieldAnalysis: getFieldAnalysis(state),
    filter: getMapBoxFilter(state),
    filteredFeatures: getFilteredFeatures(state),
    fieldMapping: getFieldMapping(state),
    colorIndex: getColorIndex(state)
  }
}

export default connect(
  mapStateToProps,
  (dispatch) => bindActionCreators(actionCreators, dispatch)
)(ViewContainer)
