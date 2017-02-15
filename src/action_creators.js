const actions = {
  updateFilter: 'UPDATE_FILTER',
  removeFilter: 'REMOVE_FILTER',
  updateVisibleFilters: 'UPDATE_VISIBLE_FILTERS',
  moveMap: 'MOVE_MAP',
  replaceFeatures: 'REPLACE_FEATURES',
  addFeatures: 'ADD_FEATURES',
  replaceMapStyle: 'REPLACE_MAP_STYLE',
  openSettings: 'OPEN_SETTINGS',
  showFeatureDetail: 'SHOW_FEATURE_DETAIL',
  closeModal: 'CLOSE_MODAL',
  switchView: 'SWITCH_VIEW'
}

const actionCreators = {}

for (var actionName in actions) {
  actionCreators[actionName] = createActionCreator(actionName)
}

function createActionCreator (actionName) {
  return function (payload) {
    return {type: actions[actionName], payload}
  }
}

module.exports = actionCreators
