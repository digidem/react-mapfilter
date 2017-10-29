import {combineReducers} from 'redux'
import {intlReducer} from 'react-intl-redux'

import features from './features'
import filters from './filters'
import filterFields from './filter_fields'
import mapPosition from './map_position'
import mapStyle from './map_style'
import ui from './ui'
import fieldMapping from './field_mapping'
import fieldOrder from './field_order'
import fieldTypes from './field_types'
import resizer from './resizer'
import settings from './settings'
import visibleFields from './visible_fields'
import print from './print'
import viewStates from './view_states'

export default combineReducers({
  features,
  filters,
  filterFields,
  mapPosition,
  mapStyle,
  ui,
  print,
  fieldMapping,
  fieldOrder,
  fieldTypes,
  intl: intlReducer,
  resizer,
  settings,
  visibleFields,
  viewStates
})
