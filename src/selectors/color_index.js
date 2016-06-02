const { createSelector } = require('reselect')

const getFieldAnalysis = require('./field_analysis')
const getColoredField = require('./colored_field')

const COLORS = require('../../config.json').colors
const DEFAULT_COLOR = '#555555'

const getColorIndex = createSelector(
  getColoredField,
  getFieldAnalysis,
  (coloredField, fieldStats) => {
    const colorIndex = {}
    const values = Object.keys(fieldStats[coloredField].values)
    if (!values) return colorIndex
    values.forEach((v, i) => {
      colorIndex[v] = COLORS[i] || DEFAULT_COLOR
    })
    return colorIndex
  }
)

module.exports = getColorIndex
