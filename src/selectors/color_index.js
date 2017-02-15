import { createSelector } from 'reselect'

import getFieldAnalysis from './field_analysis'
import getColoredField from './colored_field'

import CONFIG from '../../config.json'

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

export default getColorIndex
