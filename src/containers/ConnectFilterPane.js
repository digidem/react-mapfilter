import { connect } from 'react-redux'

import FilterPane from '../components/FilterPane'
import getFilterFields from '../selectors/filter_fields'
import getFieldAnalysis from '../selectors/field_analysis'
import getFieldMapping from '../selectors/field_mapping'
import getColorIndex from '../selectors/color_index'

import { updateFilter, openSettings } from '../action_creators'

function mapStateToProps (state) {
  return {
    filters: state.filters,
    filterFields: getFilterFields(state),
    fieldStats: getFieldAnalysis(state),
    coloredField: getFieldMapping(state).color,
    colorIndex: getColorIndex(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onUpdateFilter: filter => dispatch(updateFilter(filter)),
    onClickSettings: () => dispatch(openSettings('filters'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterPane)
