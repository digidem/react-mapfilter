const { connect } = require('react-redux')

const FilterView = require('../components/filter')
const { closeFilterConfigurator, openFilterConfigurator, updateFilter } = require('../action_creators')
const getFilterProps = require('../selectors/filter_props')

function mapDispatchToProps (dispatch) {
  return {
    handleClose: () => dispatch(closeFilterConfigurator()),
    onOpenFilterConfigurator: () => dispatch(openFilterConfigurator()),
    onUpdateFilter: filter => dispatch(updateFilter(filter))
  }
}

module.exports = connect(
  getFilterProps,
  mapDispatchToProps
)(FilterView)
