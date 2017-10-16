import { createSelector } from 'reselect'
import randomBytes from 'randombytes'

import getFieldAnalysis from './field_analysis'
import {parseDate, isArrayLike} from '../util/filter_helpers'
import getFlattenedFeatures from './flattened_features'
import {FIELD_TYPE_DATE, UNDEFINED_KEY} from '../constants'

// TODO: Create id based on hash of feature for consistency?
function uniqueId (f) {
  return randomBytes(8).toString('hex')
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

      for (var fieldName in fieldAnalysis.properties) {
        field = fieldAnalysis.properties[fieldName]
        value = typeof f.properties[fieldName] !== 'undefined' ? f.properties[fieldName] : UNDEFINED_KEY
        if (isArrayLike(field.type)) {
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
