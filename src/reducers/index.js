const { combineReducers } = require('redux')

module.exports = combineReducers({
  coloredField: require('./colored_field'),
  features: require('./features'),
  filters: require('./filters'),
  visibleFilterFields: require('./filter_fields'),
  mapPosition: require('./map_position'),
  popupFields: require('./popup_fields')
})
