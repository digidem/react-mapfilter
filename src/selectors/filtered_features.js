import { createSelector } from 'reselect'
import assign from 'object-assign'

import getFeaturesById from './features_by_id'
import getRawFilteredFeatures from './filtered_features_raw'
import getColorIndex from './color_index'
import getColoredField from './colored_field'
import CONFIG from '../../config.json'

const getFilteredFeatures = createSelector(
  getFeaturesById,
  getRawFilteredFeatures,
  getColoredField,
  getColorIndex,
  (featuresById, filteredFeatures, colorIndex, coloredField) => {
    return filteredFeatures.map((f, i) => {
      return assign({}, featuresById[f.id], {
        __label: CONFIG.labelChars.charAt(i)
      })
    })
  }
)

export default getFilteredFeatures
