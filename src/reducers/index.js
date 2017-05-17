import {combineReducers} from 'redux'
import {intlReducer} from 'react-intl-redux'

import features from './features'
import filters from './filters'
import filterFields from './filter_fields'
import mapPosition from './map_position'
import mapStyle from './map_style'
import ui from './ui'
import fieldMapping from './field_mapping'
import fieldTypes from './field_types'
import resizer from './resizer'
import settings from './settings'
import hiddenFields from './hidden_fields'

export default combineReducers({
  features,
  filters,
  filterFields,
  mapPosition,
  mapStyle,
  ui,
  fieldMapping,
  fieldTypes,
  intl: intlReducer,
  resizer,
  settings,
  hiddenFields
})
