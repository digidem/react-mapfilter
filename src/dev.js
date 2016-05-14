const React = require('react')
const ReactDOM = require('react-dom')

// Needed by material-ui for onTouchTap to work
require('react-tap-event-plugin')()

const rootEl = document.getElementById('root')

let render = function () {
  const App = require('./containers/app')
  ReactDOM.render(
    <App />,
    rootEl
  )
}

if (module.hot) {
  // Support hot reloading of components
  // and display an overlay for runtime errors
  const renderApp = render
  const renderError = (error) => {
    const RedBox = require('redbox-react')
    ReactDOM.render(
      <RedBox error={error} />,
      rootEl
    )
  }
  render = function () {
    try {
      renderApp()
    } catch (error) {
      renderError(error)
    }
  }
  module.hot.accept('./containers/app', () => {
    setTimeout(render)
  })
}

render()
