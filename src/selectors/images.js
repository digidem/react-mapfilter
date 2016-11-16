const { createSelector } = require('reselect')

const getFieldAnalysis = require('./field_analysis')
const getFilteredFeatures = require('./filtered_features')
const {FIELD_TYPES} = require('../constants')

const getImageFieldNames = createSelector(
  getFieldAnalysis,
  (fieldAnalysis) => Object.keys(fieldAnalysis).filter(
    fieldname => fieldAnalysis[fieldname].type === FIELD_TYPES.IMAGE
  )
)

/**
 * Pick the date field that appears in most records
 */
const getImages = createSelector(
  getFilteredFeatures,
  getImageFieldNames,
  (features, imageFieldNames) => {
    return features.reduce((p, feature) => {
      imageFieldNames.forEach(f => {
        if (feature.properties[f]) {
          p.push({
            url: feature.properties[f],
            featureId: feature.id
          })
        }
      })
      return p
    }, [])
  }
)

module.exports = getImages
