const React = require('react')
const ReactDOM = require('react-dom')
const MapFilter = require('../dist/mapfilter.js')
const fs = require('fs')
const path = require('path')

const sampleGeoJSON = fs.readFileSync(path.join(__dirname, './sample.geojson'), 'utf8')
const features = JSON.parse(sampleGeoJSON).features
console.log(MapFilter)
ReactDOM.render(React.createElement(MapFilter, {features: features}), document.getElementById('root'))
