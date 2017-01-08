const React = require('react')
const { connect } = require('react-redux')
const { bindActionCreators } = require('redux')
const assign = require('object-assign')

const FilterContainer = require('./filter_container')
const TopBar = require('./top_bar')
const actionCreators = require('../action_creators')
const { decodeFilter, encodeFilter } = require('../util/filter_helpers')

const MapContainer = require('./map_container')
const ReportContainer = require('./report_container')
const ImageContainer = require('./image_container')
const Modal = require('../components/modal')
const FeatureDetail = require('../components/feature_detail')
const FilterConfigurator = require('../components/filter_configurator')
const {VIEWS, MODALS} = require('../constants')

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
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 2
  }
}

class IndexRoute extends React.Component {

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
    const {activeView, modal, addButton} = this.props
    let ModalContent = getModalComponent(modal)
    console.log(ModalContent)
    return (
      <div className='outer container' style={styles.outer}>
        <TopBar />
        <div className='inner container' style={styles.inner}>
          <FilterContainer />
          {activeView === VIEWS.MAP && <MapContainer />}
          {activeView === VIEWS.PHOTOS && <ImageContainer />}
          {activeView === VIEWS.REPORT && <ReportContainer />}
          {addButton && <addButton />}
        </div>
        <Modal component={ModalContent} />
      </div>
    )
  }
}

function getModalComponent (modal) {
  switch (modal) {
    case MODALS.FEATURE_DETAIL:
      return FeatureDetail
    case MODALS.FILTER_CONFIG:
      return FilterConfigurator
    default:
      return
  }
}

module.exports = connect(
  (state) => {
    return {
      activeView: state.navigation.view,
      modal: state.navigation.modal
    }
  },
  (dispatch) => bindActionCreators(actionCreators, dispatch)
)(IndexRoute)
