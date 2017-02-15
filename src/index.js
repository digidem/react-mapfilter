require('babel-polyfill')

const React = require('react')
const { PropTypes } = React
const { Provider } = require('react-redux')
const { createStore, applyMiddleware, compose } = require('redux')
const thunk = require('redux-thunk').default
const getMuiTheme = require('material-ui/styles/getMuiTheme').default
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default
const {IntlProvider} = require('react-intl-redux')
const {addLocaleData} = require('react-intl')
const pick = require('lodash/pick')
const en = require('react-intl/locale-data/en')
const es = require('react-intl/locale-data/es')
const shallowEqual = require('shallow-equal/objects')

addLocaleData([...en, ...es])

const MFPropTypes = require('./util/prop_types')
const {capitalize} = require('./util/text_helpers')
const IndexRoute = require('./containers/index_route')
const reducers = require('./reducers')
const config = require('../config.json')
const controlledStore = require('./controlled_store')
const MapContainer = require('./containers/map_container')
const ReportContainer = require('./containers/report_container')
const ImageContainer = require('./containers/image_container')

// Roboto font
require('../css/fonts.css')
require('../css/animations.css')

// Needed by material-ui for onTouchTap to work
require('react-tap-event-plugin')()

// Attach Chrome devTools extensions if it is present.
const devTools = window.devToolsExtension ? window.devToolsExtension() : undefined
const storeEnhancer = devTools ? compose(devTools, applyMiddleware(thunk)) : applyMiddleware(thunk)

const controllableProps = [
  'features',
  'mapStyle',
  'route'
]

class MapFilter extends React.Component {
  static propTypes = {
    features: MFPropTypes.features,
    propMap: PropTypes.func,
    mapStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    addButton: PropTypes.object,
    views: PropTypes.array
  }

  static defaultProps = {
    features: [],
    propMap: prop => prop,
    mapStyle: config.defaultMapStyle,
    views: [{
      id: 'map',
      component: MapContainer
    }, {
      id: 'media',
      component: ImageContainer
    }, {
      id: 'report',
      component: ReportContainer
    }]
  }

  handleChange = (key, value) => {
    var propName = 'onChange' + capitalize(key)
    if (typeof this.props[propName] !== 'function') return
    this.props[propName](value)
  }

  constructor (props) {
    super(props)
    const stateOverride = pick(props, controllableProps)
    const controlledStoreEnhancer = controlledStore(this.handleChange, stateOverride)
    this.store = createStore(reducers, compose(controlledStoreEnhancer, storeEnhancer))
  }

  componentWillReceiveProps (nextProps) {
    if (shallowEqual(this.props, nextProps)) return
    const stateOverride = pick(nextProps, controllableProps)
    this.store.controlledUpdate(stateOverride)
  }

  render () {
    const {addButton, views} = this.props
    return <Provider store={this.store}>
      <IntlProvider>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <IndexRoute addButton={addButton} views={views} />
        </MuiThemeProvider>
      </IntlProvider>
    </Provider>
  }
}

module.exports = MapFilter
