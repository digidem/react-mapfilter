import { createSelector } from 'reselect'
import flat from 'flat'
import assign from 'object-assign'

function flattenFeatureProperties (f) {
  return assign(f, {
    properties: flat(f.properties, {safe: true})
  })
}

const getFlattenedFeatures = createSelector(
  state => state.features,
  features => features.map(flattenFeatureProperties)
)

export default getFlattenedFeatures

  // getFeaturesWithIds,
  // getColoredField,
  // getColorIndex,
  // (features, coloredField, colorIndex) => {
  //   return features.map(f => {
  //     const newProps = flat(f.properties, {safe: true})
  //     let colorHex
  //     if (coloredField) {
  //       const coloredFieldValue = newProps[coloredField]
  //       colorHex = Array.isArray(coloredFieldValue)
  //         ? colorIndex[coloredFieldValue[0]] : colorIndex[coloredFieldValue]
  //     }
  //     return assign({}, f, {
  //       properties: newProps,
  //       __color: (colorHex || CONFIG.defaultColor).slice(1)
  //     })
  //   })
  // }
