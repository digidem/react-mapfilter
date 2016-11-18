const React = require('react')
const { Provider } = require('react-redux')
const { createStore, applyMiddleware, compose } = require('redux')
const thunk = require('redux-thunk').default
const Router = require('react-router/BrowserRouter').default
const getMuiTheme = require('material-ui/styles/getMuiTheme').default
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default
const {IntlProvider} = require('react-intl-redux')
const {addLocaleData} = require('react-intl')
const en = require('react-intl/locale-data/en')
const es = require('react-intl/locale-data/es')

addLocaleData([...en, ...es])

const IndexRoute = require('./index_route')
const reducers = require('../reducers')

// Roboto font
require('../../css/fonts.css')
require('../../css/animations.css')

// Attach Chrome devTools extensions if it is present.
const devTools = window.devToolsExtension ? window.devToolsExtension() : undefined
const storeEnhancer = devTools ? compose(devTools, applyMiddleware(thunk)) : applyMiddleware(thunk)
const store = createStore(reducers, storeEnhancer)

const App = () => (
  <Provider store={store}>
    <IntlProvider>
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Router>
          {routerProps => <IndexRoute {...routerProps} />}
        </Router>
      </MuiThemeProvider>
    </IntlProvider>
  </Provider>
)

module.exports = App
