import { createSelector } from 'reselect'
import assign from 'object-assign'
import featureFilter from 'feature-filter-geojson'

import CONFIG from '../../config.json'

// **THIS IS NOT A REGULAR SELECTOR**
// It is used within the Map component to construct
// GeoJSON with extra fields for the map. We use a
// selector to save re-constructing the GeoJSON
const getMapGeoJson = createSelector(
  state => state.features,
  state => state.fieldMapping,
  state => state.colorIndex,
  state => state.filter,
  (features, fieldMapping, colorIndex, filter) => {
    let i = 0
    const ff = featureFilter(filter)
    return {
      type: 'FeatureCollection',
      features: features
        .filter(f => f.geometry)
        .map(f => {
          const newFeature = {
            type: 'feature',
            geometry: f.geometry,
            properties: assign({}, f.properties, {
              __mf_id: f.id,
              __mf_color: colorIndex[f.properties[fieldMapping.color]]
            })
          }
          if (ff(f)) newFeature.properties.__mf_label = CONFIG.labelChars.charAt(i++)
          return newFeature
        })
    }
  }
)

export default getMapGeoJson
