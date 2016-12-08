const {intlReducer} = require('react-intl-redux')
const {combineReducers} = require('redux')

module.exports = combineReducers({
  filterConfigurator: require('./filter_configurator'),
  features: require('./features'),
  filters: require('./filters'),
  visibleFilters: require('./visible_filters'),
  mapPosition: require('./map_position'),
  fieldMapping: require('./field_mapping'),
  intl: intlReducer
})
