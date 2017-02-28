import { createSelector } from 'reselect'
import randomBytes from 'randombytes'

import getFieldAnalysis from './field_analysis'
import {parseDate} from '../util/filter_helpers'
import getFlattenedFeatures from './flattened_features'
import {
  FIELD_TYPE_DATE,
  FIELD_TYPE_ARRAY,
  FIELD_TYPE_STRING_OR_ARRAY,
  FIELD_TYPE_NUMBER_OR_ARRAY
} from '../constants'

// TODO: Create id based on hash of feature for consistency?
function uniqueId (f) {
  return randomBytes(8).toString('hex')
}

const isArrayLike = {
  [FIELD_TYPE_ARRAY]: true,
  [FIELD_TYPE_NUMBER_OR_ARRAY]: true,
  [FIELD_TYPE_STRING_OR_ARRAY]: true
}

/**
 * Flattens arrays, converts dates to numbers, and ensures each feature has an id
 */
const getFilterableFeatures = createSelector(
  getFlattenedFeatures,
  getFieldAnalysis,
  (features, fieldAnalysis) => {
    const idFieldNames = Object.keys(fieldAnalysis.properties)
      .filter(fieldName => fieldAnalysis.properties[fieldName].isUnique)
    return features.map(f => {
      let i
      let field
      let value
      const newProps = {}

      for (var fieldName in f.properties) {
        field = fieldAnalysis.properties[fieldName]
        value = f.properties[fieldName]
        if (isArrayLike[field.type]) {
          // We can't filter arrays, so we flatten them
          if (!Array.isArray(value)) {
            // for fields which are a mix of arrays and numbers/strings
            newProps[fieldName + '.0'] = value
          } else {
            for (i = 0; i < value.length; i++) {
              newProps[fieldName + '.' + i] = value[i]
            }
          }
        } else if (field.type === FIELD_TYPE_DATE) {
          // Convert dates to numbers so they can be filtered and sorted
          newProps[fieldName] = +parseDate(value)
        } else {
          newProps[fieldName] = value
        }
      }

      const id = fieldAnalysis.$id.isUnique ? f.id : idFieldNames.length
        ? f.properties[idFieldNames[0]] : uniqueId(f)

      return {
        type: f.type,
        geometry: f.geometry,
        properties: newProps,
        id: id
      }
    })
  }
)

export default getFilterableFeatures
