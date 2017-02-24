import union from 'lodash/union'
import pick from 'lodash/pick'
import { createSelector } from 'reselect'

import getFieldAnalysis from './field_analysis'
import getVisibleFilters from './visible_filters'
import getColorIndex from './color_index'
import getColoredField from './colored_field'

// We're only interested in filters that apply to keys that
// actually exist in our data
const getFilters = createSelector(
  (state) => state.filters,
  getFieldAnalysis,
  (filters, fieldStats) => {
    return pick(filters, Object.keys(fieldStats))
  }
)

// We should always show filters for any fields that
// are in the current filter
const getMergedFilterFields = createSelector(
  getVisibleFilters,
  getFilters,
  (visibleFilters, filters) => {
    return union(visibleFilters, Object.keys(filters))
  }
)

const getFilterProps = createSelector(
  getFilters,
  getFieldAnalysis,
  getMergedFilterFields,
  getColorIndex,
  getColoredField,
  (filters, fieldStats, visibleFilters, colorIndex, coloredField) => {
    return {
      filters,
      fieldStats,
      visibleFilters,
      colorIndex,
      coloredField
    }
  }
)

export default getFilterProps
