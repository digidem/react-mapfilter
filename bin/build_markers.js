#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const CONFIG = require('../config.json')
const colors = CONFIG.colors
colors.push(CONFIG.defaultColor)

const buildPath = path.join(__dirname, '..', 'build', 'markers')
const markerPath = path.join(__dirname, '..', 'svg')

mkdirp.sync(buildPath)

const marker = fs.readFileSync(path.join(markerPath, 'marker.svg'), 'utf8')
const markerHover = fs.readFileSync(path.join(markerPath, 'marker-hover.svg'), 'utf8')

colors.forEach(function (color) {
  const markerBaseName = 'marker-' + color.replace('#', '')
  const coloredMarker = marker.replace('{{fillColor}}', color)
  const coloredMarkerHover = markerHover.replace('{{fillColor}}', color)
  fs.writeFile(path.join(buildPath, markerBaseName + '.svg'), coloredMarker, onWrite)
  fs.writeFile(path.join(buildPath, markerBaseName + '-hover.svg'), coloredMarkerHover, onWrite)
})

function onWrite (err) {
  if (err) console.error(err)
}
