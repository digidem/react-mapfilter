import flat from 'flat'
import { createSelector } from 'reselect'

import getFeaturesWithIds from './features_with_ids'
import getFieldAnalysis from './field_analysis'
import getIdFieldNames from './id_fields'
import {FIELD_TYPES} from '../constants'

function dateStringToNumber (dateString) {
  return +(new Date(dateString))
}

const getFilterableFeatures = createSelector(
  getFeaturesWithIds,
  getFieldAnalysis,
  getIdFieldNames,
  (features, fieldAnalysis, idFieldNames) => features.map(f => {
    // We can't filter nested objects or arrays, so we flatten feature properties
    const properties = flat(f.properties)
    // To filter dates we need to convert date strings to numbers
    Object.keys(fieldAnalysis)
      .filter(f => fieldAnalysis[f].type === FIELD_TYPES.DATE)
      .forEach(f => {
        properties[f] = dateStringToNumber(properties[f])
      })
    return Object.assign({}, f, {properties})
  })
)

export default getFilterableFeatures
