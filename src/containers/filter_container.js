const { connect } = require('react-redux')

const FilterView = require('../components/filter')
const { updateFilter, openSettings } = require('../action_creators')
const getFilterProps = require('../selectors/filter_props')
const {MODALS} = require('../constants')

function mapDispatchToProps (dispatch) {
  return {
    onUpdateFilter: filter => dispatch(updateFilter(filter)),
    onClickSettings: () => dispatch(openSettings(MODALS.FILTER_CONFIG))
  }
}

module.exports = connect(
  getFilterProps,
  mapDispatchToProps
)(FilterView)
