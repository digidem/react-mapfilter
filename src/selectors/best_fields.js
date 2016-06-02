const { createSelector } = require('reselect')

const getFieldAnalysis = require('./field_analysis')
const {FILTER_TYPES} = require('../constants')

function count (o) {
  return Object.keys(o).length
}

function getFeatureCount (state) {
  return state.features.count
}

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

  // Prefer fields with the least number of words
  return a.wordStats.mean - b.wordStats.mean
}

/**
 * Return a sorted list of the best fields to use for a filter
 */
const getBestFilterFields = createSelector(
  getFieldAnalysis,
  getFeatureCount,
  (fieldAnalysis, featureCount) => {
    const compareFn = createCompareFn(featureCount)
    const discreteFields = Object.keys(fieldAnalysis)
      .map(fieldname => fieldAnalysis[fieldname])
      .filter(field => field.filterType === FILTER_TYPES.DISCRETE)
    return discreteFields.sort(compareFn)
  }
)

module.exports = getBestFilterFields
