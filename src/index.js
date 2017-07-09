import PropTypes from 'prop-types'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {IntlProvider} from 'react-intl-redux'
import {addLocaleData} from 'react-intl'
import pick from 'lodash/pick'
import en from 'react-intl/locale-data/en'
import es from 'react-intl/locale-data/es'
import shallowEqual from 'shallow-equal/objects'
import {persistStore, autoRehydrate} from 'redux-persist'
import localForage from 'localforage'

addLocaleData([...en, ...es])

import * as MFPropTypes from './util/prop_types'
import {capitalize} from './util/text_helpers'
import IndexRoute from './containers/index_route'
import reducers from './reducers'
import controlledStore from './controlled_store'
import config from '../config.json'

// Roboto font
require('../css/fonts.css')
require('../css/animations.css')

// Attach Chrome devTools extensions if it is present.
let composeEnhancers = compose
if (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
}

const storeEnhancer = composeEnhancers(
  applyMiddleware(thunk),
  autoRehydrate()
)

const reduxPersistOptions = {
  storage: localForage,
  blacklist: [
    'features',
    'ui',
    'mapStyle'
  ],
  debounce: 500
}

const controllableProps = [
  'features',
  'mapStyle',
  'fieldTypes',
  'fieldOrder',
  'ui',
  'resizer'
]

class MapFilter extends React.Component {
  static propTypes = {
    /**
     * An array of GeoJSON Feature objects
     * Default: `[]`
     */
    features: MFPropTypes.features,
    /**
     * Called whenever features are changed (added or edited)
     * with a new array of feature objects. Use shallow equality
     * checks to get changes.
     */
    onChangeFeatures: PropTypes.func,
    /**
     * A Mapbox Style document https://www.mapbox.com/mapbox-gl-js/style-spec/
     * or a URL pointing to a style JSON
     * Default: `mapbox://styles/mapbox/streets-v9`
     */
    mapStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    /**
     * Override the field types of properties on features
     */
    fieldTypes: PropTypes.objectOf(PropTypes.string),
    /**
     * A floating action button to render in the bottom-right corner
     * https://material.io/guidelines/components/buttons-floating-action-button.html
     * Either a React Element (`<MyActionButton myProp='hello' />`)
     * or a React Component (`MyActionButton`)
     * Default: `null`
     */
    actionButton: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    /**
     * A function to return a URL to a resized version of an image. It will be passed
     * the URL to the original image, and the desired size, and should return a
     * URL to a resized version of the image. Default: `src => src`
     */
    resizer: PropTypes.func,
    views: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      component: PropTypes.func
    })),
    /**
     * Buttons to render on the right-side of the toolbar. Should be an array of either
     * React Elements or React Components.
     * Default:
     */
    toolbarButtons: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.element, PropTypes.func])),
    toolbarTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.func])
  }

  static defaultProps = {
    features: [],
    mapStyle: config.defaultMapStyle,
    resizer: src => src,
    actionButton: null
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
    persistStore(this.store, reduxPersistOptions)
  }

  componentWillReceiveProps (nextProps) {
    if (shallowEqual(this.props, nextProps)) return
    const stateOverride = pick(nextProps, controllableProps)
    this.store.controlledUpdate(stateOverride)
  }

  render () {
    const {actionButton, views, toolbarButtons, toolbarTitle} = this.props
    return <Provider store={this.store}>
      <IntlProvider>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <IndexRoute actionButton={actionButton} views={views} toolbarButtons={toolbarButtons} toolbarTitle={toolbarTitle} />
        </MuiThemeProvider>
      </IntlProvider>
    </Provider>
  }
}

export default MapFilter
