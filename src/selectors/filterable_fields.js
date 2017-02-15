import { createSelector } from 'reselect'

import getFieldAnalysis from './field_analysis'
import { FILTER_TYPES } from '../constants'

const getFilterableFields = createSelector(
  getFieldAnalysis,
  (fieldStats) => Object
      .entries(fieldStats)
      .filter(([k, v]) => v.filterType === FILTER_TYPES.DATE || v.filterType === FILTER_TYPES.DISCRETE)
      .map(([k, v]) => k)
)

export default getFilterableFields
