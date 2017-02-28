import { createSelector } from 'reselect'

import getFilteredFeatures from './filtered_features'

const LABEL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const getLabels = createSelector(
  getFilteredFeatures,
  (filteredFeatures) => {
    const labels = {}
    if (filteredFeatures.length > LABEL_CHARS.length) return labels
    for (var i = 0; i < filteredFeatures.length; i++) {
      labels[filteredFeatures[i].id] = LABEL_CHARS.charAt(i)
    }
    return labels
  }
)

export default getLabels
