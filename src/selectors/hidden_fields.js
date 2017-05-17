import { createSelector } from 'reselect'

import getFieldAnalysis from './field_analysis'
import {
  FIELD_TYPE_STRING,
  FIELD_TYPE_BOOLEAN,
  FIELD_TYPE_NUMBER,
  FIELD_TYPE_DATE,
  FIELD_TYPE_MIXED
} from '../constants'

const isInterestingField = {
  [FIELD_TYPE_STRING]: true,
  [FIELD_TYPE_BOOLEAN]: true,
  [FIELD_TYPE_NUMBER]: true,
  [FIELD_TYPE_DATE]: true,
  [FIELD_TYPE_MIXED]: true
}

const getHiddenFields = createSelector(
  state => state.hiddenFields && state.hiddenFields.length && state.hiddenFields,
  getFieldAnalysis,
  (hiddenFields, fieldAnalysis) => {
    if (hiddenFields) return hiddenFields
    hiddenFields = []
    for (let fieldname in fieldAnalysis.properties) {
      let fieldType = fieldAnalysis.properties[fieldname].type
      if (!isInterestingField[fieldType]) hiddenFields.push(fieldname)
    }
    return hiddenFields
  }
)

export default getHiddenFields
