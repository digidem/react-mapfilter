import assign from 'object-assign'

// The current UI state of the app
const defaultState = {
  willPrint: false,
  paperSize: navigator.language === 'en-US' ? 'letter' : 'a4'
}

export default function (state = defaultState, {type, payload}) {
  let newState
  switch (type) {
    case 'REQUEST_PRINT':
      newState = state.willPrint ? state : assign({}, state, {willPrint: true})
      break

    case 'CANCEL_PRINT':
      newState = !state.willPrint ? state : assign({}, state, {willPrint: false})
      break

    case 'CHANGE_PAPER_SIZE':
      newState = state.paperSize === payload ? state : assign({}, state, {paperSize: payload})
      break

    default:
      newState = state
  }
  return newState
}
