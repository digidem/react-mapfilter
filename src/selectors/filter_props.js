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

const getConfiguratorState = createSelector(
  (state) => state,
  (state) => state.filterConfigurator
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
  getConfiguratorState,
  getMergedFilterFields,
  (filters, fieldStats, configureFilters, visibleFilters) => {
    return {
      filters,
      fieldStats,
      configureFilters,
      visibleFilters
    }
  }
)

module.exports = getFilterProps
