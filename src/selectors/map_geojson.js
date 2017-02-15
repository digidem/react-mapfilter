import { createSelector } from 'reselect'

import getFilterableFeatures from './filterable_features'
import getRawFilteredFeatures from './filtered_features_raw'
import getColorIndex from './color_index'
import getColoredField from './colored_field'
import CONFIG from '../../config.json'

const getMapGeoJSON = createSelector(
  getFilterableFeatures,
  getRawFilteredFeatures,
  getColoredField,
  getColorIndex,
  (features, filteredFeatures, coloredField, colorIndex) => {
    return {
      type: 'FeatureCollection',
      features: features.map(feature => {
        const props = feature.properties
        const colorHex = colorIndex[props[coloredField] || props[coloredField + '.0']]
        const newProps = Object.assign({}, props, {
          __mf_id: feature.id,
          __mf_color: (colorHex || CONFIG.defaultColor).slice(1),
          __mf_label: CONFIG.labelChars.charAt(filteredFeatures.indexOf(feature))
        })
        return Object.assign({}, feature, {
          properties: newProps
        })
      })
    }
  }
)

export default getMapGeoJSON
