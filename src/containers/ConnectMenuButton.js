import { connect } from 'react-redux'

import MenuButton from '../components/buttons/MenuButton'
import getFilterableFeatures from '../selectors/filterable_features'

import { openSettings } from '../action_creators'

function mapStateToProps (state) {
  return {
    features: getFilterableFeatures(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    openSettings: () => dispatch(openSettings('filters'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuButton)
