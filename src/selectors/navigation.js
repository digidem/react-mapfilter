const { createSelector } = require('reselect')

const {routeRegExp} = require('../util/reducer_helpers')

const getNavigationParams = createSelector(
  state => state.route,
  route => {
    const match = routeRegExp.exec(route)
    const params = {
      activeView: match[1],
      activeModal: match[2]
    }
    switch (params.activeModal) {
      case 'settings':
        params.settingsTab = match[3]
        break
      case 'features':
        params.featureId = match[3]
        break
    }
    return params
  }
)

module.exports = getNavigationParams
