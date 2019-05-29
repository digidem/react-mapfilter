import { connect } from 'react-redux'

import MenuButton from '../components/buttons/MenuButton'
import getFilterableFeatures from '../selectors/filterable_features'
import getFieldAnalysis from '../selectors/field_analysis'
import getMapBoxFilter from '../selectors/mapbox_filter'

import { openSettings } from '../action_creators'

function mapStateToProps (state) {
  return {
    filter: getMapBoxFilter(state),
    features: getFilterableFeatures(state),
    fieldAnalysis: getFieldAnalysis(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    openSettings: () => dispatch(openSettings('filters'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuButton)
