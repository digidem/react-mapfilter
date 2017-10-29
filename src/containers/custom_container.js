import { connect } from 'react-redux'
import omit from 'lodash/omit'
import { bindActionCreators } from 'redux'
import assign from 'object-assign'

import * as actionCreators from '../action_creators'

import { createElement } from '../util/general_helpers'
import getFieldAnalysis from '../selectors/field_analysis'
import getFilterableFeatures from '../selectors/filterable_features'
import getFilteredFeatures from '../selectors/filtered_features'
import getMapBoxFilter from '../selectors/mapbox_filter'
import getFieldMapping from '../selectors/field_mapping'
import getColorIndex from '../selectors/color_index'
import getVisibleFields from '../selectors/visible_fields'

const CustomContainer = (props) => createElement(props.component, omit(props, 'component'))

function mapStateToProps (state, ownProps) {
  return {
    viewState: state.viewStates[ownProps.component.MfViewId],
    print: state.print.print,
    paperSize: state.print.paperSize,
    center: state.mapPosition.center,
    zoom: state.mapPosition.zoom,
    mapStyle: state.mapStyle,
    settings: state.settings,
    features: getFilterableFeatures(state),
    fieldAnalysis: getFieldAnalysis(state),
    fieldOrder: state.fieldOrder,
    filter: getMapBoxFilter(state),
    filteredFeatures: getFilteredFeatures(state),
    fieldMapping: getFieldMapping(state),
    colorIndex: getColorIndex(state),
    visibleFields: getVisibleFields(state)
  }
}

export default connect(
  mapStateToProps,
  (dispatch, ownProps) => assign({}, bindActionCreators(actionCreators, dispatch), {
    updateViewState: (state) => dispatch(actionCreators.updateViewState({id: ownProps.component.MfViewId, state: state}))
  })
)(CustomContainer)
