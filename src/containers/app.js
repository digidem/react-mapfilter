const React = require('react')
const { Provider } = require('react-redux')
const { createStore, applyMiddleware, compose } = require('redux')
const thunk = require('redux-thunk').default
const { Router, Route, IndexRedirect } = require('react-router')
const getMuiTheme = require('material-ui/styles/getMuiTheme').default
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default

const IndexRoute = require('./index_route')
const MapContainer = require('./map_container')
const ReportContainer = require('./report_container')
const FeatureDetail = require('../components/feature_detail')
const reducers = require('../reducers')
const history = require('../history')

// Roboto font
require('../../css/fonts.css')

// Attach Chrome devTools extensions if it is present.
const devTools = window.devToolsExtension ? window.devToolsExtension() : undefined
const storeEnhancer = compose(devTools, applyMiddleware(thunk))
const store = createStore(reducers, storeEnhancer)

const App = () => (
  <Provider store={store}>
    <MuiThemeProvider muiTheme={getMuiTheme()}>
      <Router history={history}>
        <Route path='/' component={IndexRoute}>
          <IndexRedirect to="/map" />
          <Route path='map' component={MapContainer}>
            <Route path='features/:id' component={FeatureDetail} />
          </Route>
          <Route path='report' component={ReportContainer} />
        </Route>
      </Router>
    </MuiThemeProvider>
  </Provider>
)

module.exports = App
