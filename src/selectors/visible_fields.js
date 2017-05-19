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

const getVisibleFields = createSelector(
  state => state.visibleFields && state.visibleFields.length && state.visibleFields,
  getFieldAnalysis,
  (visibleFields, fieldAnalysis) => {
    if (visibleFields) return visibleFields
    visibleFields = []
    for (let fieldname in fieldAnalysis.properties) {
      let fieldType = fieldAnalysis.properties[fieldname].type
      if (isInterestingField[fieldType]) visibleFields.push(fieldname)
    }
    return visibleFields
  }
)

export default getVisibleFields
