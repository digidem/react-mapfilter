import { createSelector } from 'reselect'
import union from 'lodash/union'
import intersect from 'lodash/intersection'

import getBestFilterFields from './best_fields'
import getFilterableFields from './filterable_fields'
import getDateFieldName from './date_field'
import getFieldAnalysis from './field_analysis'

/**
 * If we have not defined which fields to show filters for, make a best
 * guess by choosing the first date field we find, and the best filter
 * field (see `./best_field.js` for how this is guessed)
 */
const getFilterFields = createSelector(
  (state) => state.filters,
  (state) => state.filterFields,
  getBestFilterFields,
  getDateFieldName,
  getFilterableFields,
  getFieldAnalysis,
  (filters, filterFields, bestFilterFields, dateFieldName, filterableFields, fieldAnalysis) => {
    // If the user hasn't selected any filters to show, choose some good defaults
    if (filterFields == null) {
      filterFields = []
      if (dateFieldName) filterFields.push(dateFieldName)
      if (bestFilterFields[0]) filterFields.push(bestFilterFields[0].fieldname)
    }
    // Don't show filters for fields that are not filterable
    filterFields = intersect(filterFields, filterableFields)
    // Fields that are in the current filter, but only ones that exist in our dataset
    const fieldsInCurrentFilter = Object.keys(filters).filter(fieldName => fieldAnalysis.properties[fieldName])
    // Filters that should be shown in the UI are the union of fields that have been
    // selected by the user with any fields that are in the current filter
    return union(filterFields, fieldsInCurrentFilter)
  }
)

export default getFilterFields
