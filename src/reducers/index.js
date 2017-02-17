import {combineReducers} from 'redux'
import {intlReducer} from 'react-intl-redux'

import features from './features'
import filters from './filters'
import visibleFilters from './visible_filters'
import mapPosition from './map_position'
import mapStyle from './map_style'
import ui from './ui'
import fieldMapping from './field_mapping'
import resizer from './resizer'

export default combineReducers({
  features,
  filters,
  visibleFilters,
  mapPosition,
  mapStyle,
  ui,
  fieldMapping,
  intl: intlReducer,
  resizer
})
