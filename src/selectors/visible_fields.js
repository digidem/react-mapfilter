const { createSelector } = require('reselect')

const getFieldAnalysis = require('./field_analysis')
const {FIELD_TYPES} = require('../constants')

const isInterestingField = {
  [FIELD_TYPES.STRING]: true,
  [FIELD_TYPES.BOOLEAN]: true,
  [FIELD_TYPES.NUMBER]: true,
  [FIELD_TYPES.DATE]: true,
  [FIELD_TYPES.MIXED]: true
}

const getVisibleFields = createSelector(
  state => state.visibleFields && state.visibleFields.length && state.visibleFields,
  getFieldAnalysis,
  (visibleFields, fieldAnalysis) => {
    if (visibleFields) return visibleFields
    visibleFields = []
    for (let fieldname in fieldAnalysis) {
      let fieldType = fieldAnalysis[fieldname].type
      if (isInterestingField[fieldType]) visibleFields.push(fieldname)
    }
    return visibleFields
  }
)

module.exports = getVisibleFields
