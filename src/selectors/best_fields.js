import { createSelector } from 'reselect'

import getFieldAnalysis from './field_analysis'
import getFlattenedFeatures from './flattened_features'
import {FILTER_TYPE_DISCRETE, FIELD_TYPE_BOOLEAN, FIELD_TYPE_STRING} from '../constants'

function count (o) {
  if (!o) return 0
  return o.length
}

// TODO: This would be easier to follow if we did a ranking and sorted by that,
// rather than this complicated logic.

const createCompareFn = (featureCount) => (a, b) => {
  // If either field appears in less than 80% of features,
  // prefer the field that appears in more features
  const countThreshold = featureCount * 0.8
  if (a.count < countThreshold || b.count < countThreshold) {
    return b.count - a.count
  }

  // If one of the values is between 5 & 10, and the other isn't,
  // prefer the one that is.
  const aCountGood = count(a.values) >= 5 // && count(a.values) <= 10
  const bCountGood = count(b.values) >= 5 // && count(b.values) <= 10
  if (aCountGood && !bCountGood) return -1
  if (bCountGood && !aCountGood) return 1

  // Prefer boolean fields
  if (a.type === FIELD_TYPE_BOOLEAN && b.type !== FIELD_TYPE_BOOLEAN) return -1
  if (b.type === FIELD_TYPE_BOOLEAN && a.type !== FIELD_TYPE_BOOLEAN) return -1

  // Then prefer text fields
  if (a.type === FIELD_TYPE_STRING && b.type !== FIELD_TYPE_STRING) return -1
  if (b.type === FIELD_TYPE_STRING && a.type !== FIELD_TYPE_STRING) return -1

  // If both are strings, prefer fields with the least number of words
  if (a.type === FIELD_TYPE_STRING && b.type === FIELD_TYPE_STRING) {
    return a.wordStats.mean - b.wordStats.mean
  }

  return 0
}

/**
 * Return a sorted list of the best fields to use for a filter
 */
const getBestFilterFields = createSelector(
  getFieldAnalysis,
  getFlattenedFeatures,
  (fieldAnalysis, features) => {
    const compareFn = createCompareFn(features.length)
    const discreteFields = Object.keys(fieldAnalysis.properties)
      .map(fieldname => fieldAnalysis.properties[fieldname])
      .concat([fieldAnalysis.$type])
      .filter(field => field.filterType === FILTER_TYPE_DISCRETE)
    return discreteFields.sort(compareFn)
  }
)

export default getBestFilterFields
