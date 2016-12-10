const { createSelector } = require('reselect')

const getFieldAnalysis = require('./field_analysis')
const { FILTER_TYPES } = require('../constants')

const getFilterableFields = createSelector(
  getFieldAnalysis,
  (fieldStats) => Object
      .entries(fieldStats)
      .filter(([k, v]) => v.filterType)
      .filter(([k, v]) => v.filterType === FILTER_TYPES.DATE || v.filterType === FILTER_TYPES.DISCRETE)
      .map(([k, v]) => k)
)

module.exports = getFilterableFields
