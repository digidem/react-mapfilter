const React = require('react')
const { connect } = require('react-redux')
const { bindActionCreators } = require('redux')
const Match = require('react-router/Match').default
const Redirect = require('react-router/Redirect').default
const Miss = require('react-router/Miss').default
const assign = require('object-assign')
const deepEqual = require('deep-equal')

const FilterContainer = require('./filter_container')
const TopBar = require('./top_bar')
const actionCreators = require('../action_creators')
const { decodeFilter, encodeFilter } = require('../util/filter_helpers')

const MapContainer = require('./map_container')
const ReportContainer = require('./report_container')
const ImageContainer = require('./image_container')
const FeatureModal = require('../components/feature_modal')
const MatchModal = require('../components/match_modal')

const styles = {
  outer: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Roboto, sans-serif',
    WebkitFontSmoothing: 'antialiased',
    fontSize: 15,
    lineHeight: '24px'
  },
  inner: {
    display: 'flex',
    flex: 1
  }
}

class IndexRoute extends React.Component {
  closeModal = () => {
    const {router, location} = this.props
    const newLocation = assign({}, location, {
      pathname: '/' + location.pathname.split('/')[1]
    })
    router.transitionTo(newLocation)
  }

  openFeatureModal = id => {
    const {router, location} = this.props
    const newLocation = assign({}, location, {
      pathname: '/' + location.pathname.split('/')[1] + '/features/' + id
    })
    router.transitionTo(newLocation)
  }

  // Read the filter and map position from the URL on first load
  componentWillMount () {
    const {filters, location: {query}, updateFilter, router} = this.props

    // If `filter` is not set, try to read it from the URL query parameter
    // and update the application state.
    if ((filters == null || Object.keys(filters).length === 0) && query && query.filter) {
      try {
        updateFilter(decodeFilter(query.filter))
      } catch (e) {
        console.warn('Could not parse filter from URL, resetting filter')
        // Remove an invalid filter from the URL.
        const newQuery = assign({}, query, {filter: undefined})
        const newLocation = assign({}, this.props.location, newQuery)
        router.replaceWith(newLocation)
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    const { filters, location, router } = this.props

    if (filters === nextProps.filters) {
      return
    }

    // TODO: If the URL is more than 2000 characters (i.e. for large
    // filters) this will break IE < Edge.
    // http://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
    router.transitionTo(assign({}, location, {
      search: null,
      query: assign({}, nextProps.location.query, {
        filter: encodeFilter(nextProps.filters)
      })
    }))
  }

  render () {
    const {location} = this.props
    const sections = ['map', 'photos', 'report']
    const tabs = sections.map(section => ({
      active: section === location.pathname.split('/')[1],
      id: section,
      link: {
        pathname: '/' + section,
        query: location.query
      }
    }))

    return (
      <div className='outer container' style={styles.outer}>
        <TopBar tabs={tabs} />
        <div className='inner container' style={styles.inner}>
          <FilterContainer />
          <Match pattern='/map' render={matchProps => (
            <MapContainer {...matchProps} onMarkerClick={this.openFeatureModal} />
          )} />
          <Match pattern='/photos' render={matchProps => (
            <ImageContainer {...matchProps} onImageClick={this.openFeatureModal} />
          )} />
          <Match pattern='/report' component={ReportContainer} />
        </div>
        <MatchModal
          pattern='/:section(map|photos|report)/features/:id'
          render={matchProps => (
            <FeatureModal
              id={matchProps.params.id}
              onCloseClick={this.closeModal}
            />
        )} />
        <Miss render={() => <Redirect to='/map' />} />
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
