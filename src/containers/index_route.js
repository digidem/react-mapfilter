const React = require('react')
const { connect } = require('react-redux')
const { bindActionCreators } = require('redux')

const FilterContainer = require('./filter_container')
const TopBar = require('./top_bar')
const actionCreators = require('../action_creators')
const history = require('../history')
const {decodeFilter} = require('../util/filter_helpers')

const style = {
  width: '100vw',
  height: '100vh',
  position: 'relative'
}

class IndexRoute extends React.Component {
  // Read the filter and map position from the URL on first load
  componentWillMount () {
    const {filters, location: {query}, updateFilter} = this.props

    // If `filter` is not set, try to read it from the URL query parameter
    // and update the application state.
    if (!filters && query.filter) {
      try {
        updateFilter(decodeFilter(query.filter))
      } catch (e) {
        console.warn('Could not parse filter from URL, reseting filter')
        // Remove an invalid filter from the URL.
        history.replace({query: {
          ...query,
          filter: undefined
        }})
      }
    }
  }

  render () {
    const {children} = this.props
    return (
      <div style={style}>
        <TopBar />
        <FilterContainer />
        {children && React.cloneElement(children)}
      </div>
    )
  }
}

module.exports = connect(
  (state) => {
    return {
      filters: state.filters
    }
  },
  (dispatch) => bindActionCreators(actionCreators, dispatch)
)(IndexRoute)
