import { createSelector } from 'reselect'

import getFieldAnalysis from './field_analysis'
import getRawFilteredFeatures from './filtered_features_raw'
import {FIELD_TYPES} from '../constants'

const getImageFieldNames = createSelector(
  getFieldAnalysis,
  (fieldAnalysis) => Object.keys(fieldAnalysis).filter(
    fieldname => fieldAnalysis[fieldname].type === FIELD_TYPES.IMAGE
  )
)

const getImages = createSelector(
  getRawFilteredFeatures,
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
