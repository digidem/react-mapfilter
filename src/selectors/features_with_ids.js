import { createSelector } from 'reselect'
import randomBytes from 'randombytes'

import getFieldAnalysis from './field_analysis'
import getIdFieldNames from './id_fields'

function uniqueId () {
  return randomBytes(8).toString('hex')
}

const getFeaturesWithIds = createSelector(
  (state) => state.features,
  getFieldAnalysis,
  getIdFieldNames,
  (features, fieldAnalysis, idFieldNames) => features.map(f => {
    // We use an existing id feature property, if it is unique across all features,
    // or we use any unique id field we find under properties, or, failing that,
    // we generate a unique id.
    const id = fieldAnalysis.$id.isUnique ? f.id
      : f.properties[idFieldNames[0]] || uniqueId()
    return Object.assign({}, f, {id})
  })
)

export default getFeaturesWithIds
