import { createSelector } from 'reselect'

import getFlattenedFeatures from './flattened_features'

const getFeaturesById = createSelector(
  getFlattenedFeatures,
  (features) => features.reduce((p, v) => {
    p[v.id] = v
    return p
  }, {})
)

export default getFeaturesById
