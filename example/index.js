/* global fetch */
const React = require('react')
const ReactDOM = require('react-dom')
const MapFilter = require('../src/index.js')
// const fs = require('fs')
// const path = require('path')

// const sampleGeoJSON = fs.readFileSync(path.join(__dirname, './sample.geojson'), 'utf8')
// const features = JSON.parse(sampleGeoJSON).features

const mapStyle = require('./map_style/style.json')
const loc = window.location
const baseUrl = loc.protocol + '//' + loc.host + '/map_style/'
;['glyphs', 'sprite'].forEach(function (key) {
  mapStyle[key] = mapStyle[key].replace(/mapfilter:\/\//, baseUrl)
})

const mf = React.createElement(MapFilter, {
  mapStyle,
  xformUploader: {
    mediaUrl: 'http://localhost:3210/media/create',
    observationsUrl: 'http://localhost:3210/obs/create'
  }
})

fetch(`http://localhost:3210/obs/list`)
  .then(rsp => rsp.text())
  .then(lines => {
    const observations = lines
      .split('\n')
      .filter(line => !!line)
      .map(JSON.parse)

    const features = observations
          .map(x => x.tags)
          .map(x => x.data)

    console.log('features:', features)

    ReactDOM.render(
      React.cloneElement(mf,
        {
          features
        }),
      document.getElementById('root'))
  })
  .catch(err => console.warn(err.stack))

ReactDOM.render(mf, document.getElementById('root'))

// ReactDOM.render(React.createElement(MapFilter, {features: features}), document.getElementById('root'))
