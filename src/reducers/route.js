const {routeRegExp} = require('../util/reducer_helpers')

const route = (state = '/', {type, payload}) => {
  const match = routeRegExp.exec(state)
  switch (type) {
    case 'SWITCH_VIEW':
      return `/${payload}/`
    case 'OPEN_SETTINGS':
      return `/${match[1]}/settings/${payload}/`
    case 'CLOSE_MODAL':
      return `/${match[1]}/`
    case 'SHOW_FEATURE_DETAIL':
      return `/${match[1]}/features/${payload}/`
    default:
      return state
  }
}

module.exports = route
