const React = require('react')
const { connect } = require('react-redux')
const { bindActionCreators } = require('redux')
const Match = require('react-router/Match').default
const Redirect = require('react-router/Redirect').default
const Miss = require('react-router/Miss').default

const FilterContainer = require('./filter_container')
const TopBar = require('./top_bar')
const actionCreators = require('../action_creators')
const {decodeFilter} = require('../util/filter_helpers')

const MapContainer = require('./map_container')
const ReportContainer = require('./report_container')
const ImageContainer = require('./image_container')
const FeatureDetail = require('../components/feature_detail')
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
  closeFeatureDetail = () => {
    const {router, location} = this.props
    router.transitionTo({
      ...location,
      pathname: '/' + location.pathname.split('/')[1]
    })
  }

  openFeatureDetail = id => {
    const {router, location} = this.props
    router.transitionTo({
      ...location,
      pathname: '/' + location.pathname.split('/')[1] + '/features/' + id
    })
  }

  // Read the filter and map position from the URL on first load
  componentWillMount () {
    const {filters, location: {query}, updateFilter, router} = this.props

    // If `filter` is not set, try to read it from the URL query parameter
    // and update the application state.
    if (!filters && query.filter) {
      try {
        updateFilter(decodeFilter(query.filter))
      } catch (e) {
        console.warn('Could not parse filter from URL, reseting filter')
        // Remove an invalid filter from the URL.
        router.replaceWith({query: {
          ...query,
          filter: undefined
        }})
      }
    }
  }

  render () {
    const {location} = this.props
    const sections = ['map', 'photos', 'report']
    const tabs = sections.map(section => ({
      active: section === location.pathname.split('/')[1],
      id: section,
      link: '/' + section
    }))

    return (
      <div style={styles.outer}>
        <TopBar tabs={tabs} />
        <div style={styles.inner}>
          <FilterContainer />
          <Match pattern='/map' render={matchProps => (
            <MapContainer {...matchProps} onMarkerClick={this.openFeatureDetail} />
          )} />
          <Match pattern='/photos' render={matchProps => (
            <ImageContainer {...matchProps} onImageClick={this.openFeatureDetail} />
          )} />
          <Match pattern='/report' component={ReportContainer} />
        </div>
        <MatchModal
          pattern='/:section(map|photos|report)/features/:id'
          render={matchProps => (
            <FeatureDetail
              id={matchProps.params.id}
              onCloseClick={this.closeFeatureDetail}
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
