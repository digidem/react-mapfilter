const { combineReducers } = require('redux')

module.exports = combineReducers({
  features: require('./features'),
  filters: require('./filters'),
  visibleFilters: require('./visible_filters'),
  mapPosition: require('./map_position'),
  fieldMapping: require('./field_mapping')
})
