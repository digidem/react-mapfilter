const { createSelector } = require('reselect')

const getFieldAnalysis = require('./field_analysis')

const getCandidateFilters = createSelector(
  getFieldAnalysis,
  (fieldStats) => Object
      .entries(fieldStats)
      .filter(([k, v]) => v.filterType)
      .filter(([k, v]) => v.filterType !== 'TEXT')
)

module.exports = getCandidateFilters
