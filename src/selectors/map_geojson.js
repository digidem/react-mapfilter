const { createSelector } = require('reselect')

const getFlattenedFeatures = require('./flattened_features')
const getColorIndex = require('./color_index')
const getColoredField = require('./colored_field')

const getMapGeoJSON = createSelector(
  [getFlattenedFeatures, getColoredField, getColorIndex],
  (features, coloredField, colorIndex) => {
    return {
      type: 'FeatureCollection',
      features: features.map(feature => {
        const props = feature.properties
        const newProps = Object.assign({}, props, {
          __mf_id: feature.id,
          __mf_color: colorIndex[props[coloredField]].slice(1)
        })
        return Object.assign({}, feature, {
          properties: newProps
        })
      })
    }
  }
)

module.exports = getMapGeoJSON
