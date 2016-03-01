const React = require('react')
const ReactDOM = require('react-dom')
const { Provider } = require('react-redux')
const { createStore } = require('redux')

const App = require('./containers/app')
const reducers = require('./reducers')

// require('../css/index.css')

const store = createStore(reducers, window.devToolsExtension ? window.devToolsExtension() : undefined)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
