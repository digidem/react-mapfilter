import React from 'react'
import ReactDOM from 'react-dom'
import RedBox from 'redbox-react'

import App from './containers/app'

// Needed by material-ui for onTouchTap to work
require('react-tap-event-plugin')()

const rootEl = document.getElementById('root')

let render = function () {
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
