import { createSelector } from 'reselect'

import getFieldAnalysis from './field_analysis'
import {FIELD_TYPES} from '../constants'

/**
 * Pick the date field that appears in most records
 */
const getDateFieldName = createSelector(
  getFieldAnalysis,
  (fieldAnalysis) => {
    let dateField
    for (let fieldname in fieldAnalysis) {
      const field = fieldAnalysis[fieldname]
      if (field.type !== FIELD_TYPES.DATE) continue
      if (!dateField || field.count > dateField.count) {
        dateField = field
      }
    }
    return dateField && dateField.fieldname
  }
)

export default getDateFieldName
