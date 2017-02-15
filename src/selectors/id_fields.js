import { createSelector } from 'reselect'

import getFieldAnalysis from './field_analysis'

/**
 * Pick the id field that appears in most records
 */
const getIdFieldNames = createSelector(
  getFieldAnalysis,
  (fieldAnalysis) => {
    const idFields = []
    for (let fieldname in fieldAnalysis) {
      const field = fieldAnalysis[fieldname]
      if (field.isUnique) idFields.push(field.fieldname)
    }
    return idFields
  }
)

export default getIdFieldNames
