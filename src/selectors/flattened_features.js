import { createSelector } from 'reselect'
import flat from 'flat'
import assign from 'object-assign'

import getFeaturesWithIds from './features_with_ids'
import getColorIndex from './color_index'
import getColoredField from './colored_field'
import CONFIG from '../../config.json'

const getFlattenedFeatures = createSelector(
  getFeaturesWithIds,
  getColoredField,
  getColorIndex,
  (features, coloredField, colorIndex) => {
    return features.map(f => {
      const newProps = flat(f.properties, {safe: true})
      let colorHex
      if (coloredField) {
        const coloredFieldValue = newProps[coloredField]
        colorHex = Array.isArray(coloredFieldValue)
          ? colorIndex[coloredFieldValue[0]] : colorIndex[coloredFieldValue]
      }
      return assign({}, f, {
        properties: newProps,
        __color: (colorHex || CONFIG.defaultColor).slice(1)
      })
    })
  }
)

export default getFlattenedFeatures
