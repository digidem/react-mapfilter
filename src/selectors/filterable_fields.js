import { createSelector } from 'reselect'

import getFieldAnalysis from './field_analysis'
import {
  FILTER_TYPE_DISCRETE,
  FILTER_TYPE_DATE
} from '../constants'

const isFilterable = {
  [FILTER_TYPE_DISCRETE]: true,
  [FILTER_TYPE_DATE]: true
}

const getFilterableFields = createSelector(
  getFieldAnalysis,
  (fieldAnalysis) => Object.keys(fieldAnalysis.properties)
    .filter(fieldName => isFilterable[fieldAnalysis.properties[fieldName].filterType])
)

export default getFilterableFields
