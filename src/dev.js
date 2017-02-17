import React from 'react'
import ReactDOM from 'react-dom'
import RedBox from 'redbox-react'

const MapFilter = require('./index').default
const fs = require('fs')
const path = require('path')

const sampleGeoJSON = fs.readFileSync(path.join(__dirname, '../example/sample.geojson'), 'utf8')
const features = JSON.parse(sampleGeoJSON).features

const rootEl = document.getElementById('root')

let render = function () {
  ReactDOM.render(
    <MapFilter features={features} />,
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
  module.hot.accept('./index', () => {
    setTimeout(render)
  })
}

render()
