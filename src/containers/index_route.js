const React = require('react')
const { connect } = require('react-redux')
const { bindActionCreators } = require('redux')
const find = require('lodash/find')

const FilterContainer = require('./filter_container')
const TopBar = require('./top_bar')
const actionCreators = require('../action_creators')
const getNavigationParams = require('../selectors/navigation')

const Modal = require('../components/modal')
const FeatureDetail = require('../components/feature_detail')
const FilterConfigurator = require('../components/filter_configurator')

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
  componentWillMount () {
    this.redirectIfNecessary(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.redirectIfNecessary(nextProps)
  }

  redirectIfNecessary ({activeModal, activeView, views, closeModal, switchView}) {
    if (activeModal && !getModalComponent(activeModal)) closeModal()
    if (!find(views, {id: activeView})) switchView(views[0].id)
  }

  render () {
    const {activeView, activeModal, addButton, views, switchView} = this.props
    const ModalComponent = getModalComponent(activeModal)
    const ViewComponent = getViewComponent(activeView, views)

    return (
      <div className='outer container' style={styles.outer}>
        <TopBar views={views} activeView={activeView} onChangeTab={switchView} />
        <div className='inner container' style={styles.inner}>
          <FilterContainer />
          <ViewComponent />
          {addButton && <div style={styles.addButton}><addButton /></div>}
        </div>
        <Modal component={ModalComponent} />
      </div>
    )
  }
}

function getModalComponent (modal) {
  switch (modal) {
    case 'features':
      return FeatureDetail
    case 'settings':
      return FilterConfigurator
    default:
      return
  }
}

function getViewComponent (activeView, views) {
  var view = find(views, {id: activeView})
  if (!view) return () => <div />
  var ViewComponent = connect(view.mapStateToProps, view.mapDispatchToProps)(view.component)
  return ViewComponent
}

module.exports = connect(
  (state) => getNavigationParams(state),
  (dispatch) => bindActionCreators(actionCreators, dispatch)
)(IndexRoute)
