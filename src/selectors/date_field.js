const { createSelector } = require('reselect')

const getFieldAnalysis = require('./field_analysis')
const {FIELD_TYPES} = require('../constants')

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

module.exports = getDateFieldName
