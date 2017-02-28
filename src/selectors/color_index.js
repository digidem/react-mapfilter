import { createSelector } from 'reselect'

import getFieldAnalysis from './field_analysis'
import getFieldMapping from './field_mapping'

import CONFIG from '../../config.json'

const getColorIndex = createSelector(
  getFieldMapping,
  getFieldAnalysis,
  (fieldMapping, fieldAnalysis) => {
    if (!fieldMapping.color) return
    const coloredField = fieldAnalysis.properties[fieldMapping.color]
    const colorIndex = {}
    if (!coloredField || !coloredField.values) return colorIndex
    const values = coloredField.values.map(v => v.value)
    values.forEach((v, i) => {
      colorIndex[v] = CONFIG.colors[i] || CONFIG.defaultColor
    })
    return colorIndex
  }
)

export default getColorIndex
