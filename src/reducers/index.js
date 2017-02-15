const {intlReducer} = require('react-intl-redux')
const {combineReducers} = require('redux')

module.exports = combineReducers({
  features: require('./features'),
  filters: require('./filters'),
  visibleFilters: require('./visible_filters'),
  mapPosition: require('./map_position'),
  mapStyle: require('./map_style'),
  route: require('./route'),
  fieldMapping: require('./field_mapping'),
  intl: intlReducer
})
