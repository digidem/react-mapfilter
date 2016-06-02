const union = require('lodash/union')
const pick = require('lodash/pick')
const { createSelector } = require('reselect')

const getFieldAnalysis = require('./field_analysis')
const getVisibleFilters = require('./visible_filters')

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
  (filters, fieldStats, visibleFilters) => {
    return {
      filters,
      fieldStats,
      visibleFilters
    }
  }
)

module.exports = getFilterProps
