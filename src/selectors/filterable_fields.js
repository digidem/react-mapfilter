import { createSelector } from 'reselect'

import getFieldAnalysis from './field_analysis'
import {
  FILTER_TYPE_DISCRETE,
  FILTER_TYPE_DATE
} from '../constants'

const getFilterableFields = createSelector(
  getFieldAnalysis,
  (fieldAnalysis) => Object
      .entries(fieldAnalysis.properties)
      .filter(([k, v]) => v.filterType === FILTER_TYPE_DATE || v.filterType === FILTER_TYPE_DISCRETE)
      .map(([k, v]) => k)
)

export default getFilterableFields
