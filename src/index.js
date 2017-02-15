import React, { PropTypes } from 'react'
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

addLocaleData([...en, ...es])

import * as MFPropTypes from './util/prop_types'
import {capitalize} from './util/text_helpers'
import IndexRoute from './containers/index_route'
import reducers from './reducers'
import controlledStore from './controlled_store'
import MapContainer from './containers/map_container'
import ReportContainer from './containers/report_container'
import ImageContainer from './containers/image_container'
import config from '../config.json'

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
  'ui'
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

export default MapFilter
