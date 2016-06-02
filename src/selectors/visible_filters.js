const { createSelector } = require('reselect')
const intersect = require('lodash/intersection')

const getBestFilterFields = require('./best_fields')
const getFieldAnalysis = require('./field_analysis')
const getDateFieldName = require('./date_field')

const getFilterableFields = createSelector(
  getFieldAnalysis,
  (fieldAnalysis) => Object.keys(fieldAnalysis).filter(f => fieldAnalysis[f].filterType)
)

/**
 * If we have not defined which fields to show filters for, make a best
 * guess by choosing the first date field we find, and the best filter
 * field (see `./best_field.js` for how this is guessed)
 */
const getVisibleFilters = createSelector(
  (state) => state.visibleFilters,
  getBestFilterFields,
  getDateFieldName,
  getFilterableFields,
  (visibleFilters, bestFilterFields, dateFieldName, filterableFields) => {
    if (!visibleFilters || visibleFilters.length === 0) {
      visibleFilters = []
      if (dateFieldName) visibleFilters.push(dateFieldName)
      if (bestFilterFields[0]) visibleFilters.push(bestFilterFields[0].fieldname)
    }
    return intersect(visibleFilters, filterableFields)
  }
)

module.exports = getVisibleFilters
