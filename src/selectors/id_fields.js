import { createSelector } from 'reselect'

import getFieldAnalysis from './field_analysis'

/**
 * Return any unique fields as potential id fields
 */
const getIdFieldNames = createSelector(
  getFieldAnalysis,
  (fieldAnalysis) => {
    const idFields = []
    for (let fieldname in fieldAnalysis.properties) {
      const field = fieldAnalysis.properties[fieldname]
      if (field.isUnique) idFields.push(field.fieldname)
    }
    return idFields
  }
)

export default getIdFieldNames
