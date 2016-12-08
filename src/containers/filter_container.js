const { connect } = require('react-redux')

const FilterView = require('../components/filter')
const { updateFilter } = require('../action_creators')
const getFilterProps = require('../selectors/filter_props')

function mapDispatchToProps (dispatch) {
  return {
    onUpdateFilter: filter => dispatch(updateFilter(filter))
  }
}

module.exports = connect(
  getFilterProps,
  mapDispatchToProps
)(FilterView)
