const { combineReducers } = require('redux')

module.exports = combineReducers({
  features: require('./features'),
  filter: require('./filter'),
  mapPosition: require('./map_position'),
  popupFields: require('./popup_fields'),
  coloredField: require('./colored_field')
})
