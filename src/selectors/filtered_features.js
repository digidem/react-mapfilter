var ff = require('feature-filter-geojson')
const { createSelector } = require('reselect')

const getFlattenedFeatures = require('./flattened_features')
const getMapboxFilter = require('./mapbox_filter')

const datesToNumbers = createSelector(
  getFlattenedFeatures,
  features => features.map(feature => {
    const props = feature.properties
    const newProps = Object.assign({}, props)
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
)

const getFilteredFeatures = createSelector(
  datesToNumbers,
  getMapboxFilter,
  (features, filter) => features.filter(ff(filter))
)

module.exports = getFilteredFeatures
