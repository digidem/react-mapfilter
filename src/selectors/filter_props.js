const union = require('lodash/union')
const intersect = require('lodash/intersection')
const pick = require('lodash/pick')
const { createSelector } = require('reselect')

const getFieldStats = require('./field_stats')

// We're only interested in filters that apply to keys that
// actually exist in our data
const getFilters = createSelector(
  (state) => state.filters,
  getFieldStats,
  (filters, fieldStats) => {
    return pick(filters, Object.keys(fieldStats))
  }
)

// We don't show filters for fields that aren't in our data
const getVisibleFilterFields = createSelector(
  (state) => state.visibleFilterFields,
  getFieldStats,
  (filterFields, fieldStats) => {
    return intersect(filterFields, Object.keys(fieldStats))
  }
)

// We should always show filters for any fields that
// are in the current filter
const getMergedFilterFields = createSelector(
  getVisibleFilterFields,
  getFilters,
  (filterFields, filters) => {
    return union(filterFields, Object.keys(filters))
  }
)

const getFilterProps = createSelector(
  getFilters,
  getFieldStats,
  getMergedFilterFields,
  (filters, fieldStats, visibleFilterFields) => {
    return {
      filters,
      fieldStats,
      visibleFilterFields
    }
  }
)

module.exports = getFilterProps
