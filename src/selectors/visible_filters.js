import { createSelector } from 'reselect'
import intersect from 'lodash/intersection'

import getBestFilterFields from './best_fields'
import getFieldAnalysis from './field_analysis'
import getFilterableFields from './filterable_fields'
import getDateFieldName from './date_field'

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
    if (visibleFilters == null) {
      visibleFilters = []
      if (dateFieldName) visibleFilters.push(dateFieldName)
      if (bestFilterFields[0]) visibleFilters.push(bestFilterFields[0].fieldname)

      return visibleFilters
    }
    return intersect(visibleFilters, filterableFields)
  }
)

export default getVisibleFilters
