const { createSelector } = require('reselect')

const getFieldAnalysis = require('./field_analysis')
const getColoredField = require('./colored_field')

const CONFIG = require('../../config.json')

const getColorIndex = createSelector(
  getColoredField,
  getFieldAnalysis,
  (coloredField, fieldStats) => {
    const colorIndex = {}
    if (!coloredField) return colorIndex
    const values = Object.keys(fieldStats[coloredField].values)
    if (!values) return colorIndex
    values.forEach((v, i) => {
      colorIndex[v] = CONFIG.colors[i] || CONFIG.defaultColor
    })
    return colorIndex
  }
)

module.exports = getColorIndex
