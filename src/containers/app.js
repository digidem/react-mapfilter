const React = require('react')
const { Provider } = require('react-redux')
const { createStore } = require('redux')
const { Router, Route } = require('react-router')

const IndexRoute = require('./index_route')
const FeatureDetail = require('../components/feature_detail')
const reducers = require('../reducers')
const history = require('../history')

// Attach Chrome devTools extensions if it is present.
const devTools = window.devToolsExtension ? window.devToolsExtension() : undefined
const store = createStore(reducers, devTools)

const App = () => (
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={IndexRoute}>
        <Route path='features/:id' component={FeatureDetail} />
        <Route path=':view' />
      </Route>
    </Router>
  </Provider>
)

module.exports = App
