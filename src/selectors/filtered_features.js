import ff from 'feature-filter-geojson'
import { createSelector } from 'reselect'

import getFilterableFeatures from './filterable_features'
import getMapboxFilter from './mapbox_filter'

const getFilteredFeatures = createSelector(
  getFilterableFeatures,
  getMapboxFilter,
  (features, filter) => features.filter(ff(filter))
)

export default getFilteredFeatures
