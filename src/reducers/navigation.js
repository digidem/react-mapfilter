const assign = require('object-assign')
const {VIEWS, MODALS} = require('../constants')

const initialNavigation = {
  view: VIEWS.MAP,
  modal: null
}

const navigation = (state = initialNavigation, {type, payload}) => {
  switch (type) {
    case 'OPEN_SETTINGS':
      if (!MODALS[payload]) return state
      return assign({}, state, {
        modal: payload
      })

    case 'CLOSE_MODAL':
      return assign({}, state, {
        modal: null
      })
    default:
      return state
  }
}

module.exports = navigation
