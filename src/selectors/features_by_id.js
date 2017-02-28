import { createSelector } from 'reselect'

import getFilterableFeatures from './filterable_features'

const getFeaturesById = createSelector(
  getFilterableFeatures,
  (features) => features.reduce((p, v) => {
    p[v.id] = v
    return p
  }, {})
)

export default getFeaturesById
