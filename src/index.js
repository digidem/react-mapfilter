const React = require('react')
const ReactDOM = require('react-dom')
const { Provider } = require('react-redux')
const { createStore } = require('redux')
const { Router, Route } = require('react-router')

const App = require('./containers/app')
const FeatureDetail = require('./components/feature_detail')
const reducers = require('./reducers')
const history = require('./history')

// require('../css/index.css')

const store = createStore(reducers, window.devToolsExtension ? window.devToolsExtension() : undefined)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <Route path='features/:id' component={FeatureDetail} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
