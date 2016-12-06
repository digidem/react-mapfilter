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
          __mf_color: colorIndex[props[coloredField] || props[coloredField + '.0']].slice(1)
        })
        // Coerce dates to numbers
        // TODO: This should be faster by using field analysis to find date
        // fields rather than iterating properties on each feature
        for (let key in props) {
          if (props[key] instanceof Date) {
            newProps[key] = +props[key]
          }
        }
        return Object.assign({}, feature, {
          properties: newProps
        })
      })
    }
  }
)

module.exports = getMapGeoJSON
