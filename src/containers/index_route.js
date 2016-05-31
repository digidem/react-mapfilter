const React = require('react')
const { connect } = require('react-redux')
const { bindActionCreators } = require('redux')
const Modal = require('react-modal')

const FilterContainer = require('./filter_container')
const TopBar = require('./top_bar')
const actionCreators = require('../action_creators')
const history = require('../history')
const {decodeFilter} = require('../util/filter_helpers')

const styles = {
  outer: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  inner: {
    display: 'flex',
    flex: 1
  }
}

const modalStyles = {
  overlay: {
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    position: 'static',
    flex: 1,
    border: 'none',
    background: 'none',
    overflow: 'visible',
    WebkitOverflowScrolling: 'touch',
    borderRadius: 0,
    outline: 'none',
    margin: 0,
    padding: 0,
    height: 'calc(100% - 80px)',
    display: 'flex',
    alignItems: 'center',
    maxWidth: 500
  }
}

class IndexRoute extends React.Component {
  closeFeatureDetail = () => {
    const {location} = this.props
    history.push({
      ...location,
      pathname: '/' + location.pathname.split('/')[1]
    })
  }

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
    const {children, params} = this.props
    const featureDetail = children && children.props.children
    return (
      <div style={styles.outer}>
        <TopBar />
        <div style={styles.inner}>
          <FilterContainer />
          {children && React.cloneElement(children)}
        </div>
        {featureDetail &&
          <Modal
            isOpen={!!featureDetail}
            onRequestClose={this.closeFeatureDetail}
            style={modalStyles}>
            {React.cloneElement(featureDetail, {...params, onCloseClick: this.closeFeatureDetail})}
          </Modal>
        }
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
