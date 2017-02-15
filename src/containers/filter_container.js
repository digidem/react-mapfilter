import { connect } from 'react-redux'

import FilterView from '../components/filter'
import { updateFilter, openSettings } from '../action_creators'
import getFilterProps from '../selectors/filter_props'

function mapDispatchToProps (dispatch) {
  return {
    onUpdateFilter: filter => dispatch(updateFilter(filter)),
    onClickSettings: () => dispatch(openSettings('filters'))
  }
}

export default connect(
  getFilterProps,
  mapDispatchToProps
)(FilterView)
