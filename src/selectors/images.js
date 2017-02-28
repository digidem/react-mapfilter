import { createSelector } from 'reselect'

import getFieldAnalysis from './field_analysis'
import getFilteredFeatures from './filtered_features'
import { FIELD_TYPE_IMAGE } from '../constants'

const getImageFieldNames = createSelector(
  getFieldAnalysis,
  (fieldAnalysis) => Object.keys(fieldAnalysis.properties).filter(
    fieldname => fieldAnalysis.properties[fieldname].type === FIELD_TYPE_IMAGE
  )
)

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

export default getImages
