import assign from 'object-assign'

// The current UI state of the app
const defaultState = {
  // The current main view of the data
  activeView: undefined,
  // The current open modal
  activeModal: null,
  // Whether the filter pane is shown or hidden
  showFilterPane: true,
  // The current tab of the settings modal (if open)
  settingsTab: null,
  // The id of the feature to show in the feature modal (if open)
  featureId: null,
  // redirect is true if the ui state was invalid and was redirected to a valid state
  redirect: false
}

export default function (state = defaultState, {type, payload}) {
  let newState
  switch (type) {
    case 'TOGGLE_FILTER_PANE':
      newState = state.showFilterPane
        ? assign({}, state, {showFilterPane: false}) : assign({}, state, {showFilterPane: true})
      break

    case 'SWITCH_VIEW':
      newState = state.activeView === payload
        ? state : assign({}, state, {activeView: payload})
      break

    case 'OPEN_SETTINGS':
      newState = state.activeModal === 'settings' && state.settingsTab === payload
        ? state : assign({}, state, {activeModal: 'settings', settingsTab: payload})
      break

    case 'CLOSE_MODAL':
      newState = !state.activeModal ? state : assign({}, state, {activeModal: null})
      break

    case 'SHOW_FEATURE_DETAIL':
      newState = state.activeModal === 'feature' && state.featureId === payload
        ? state : assign({}, state, {activeModal: 'feature', featureId: payload})
      break

    case 'REDIRECT_VIEW':
      newState = assign({}, state, {activeView: payload, activeModal: null, redirect: true})
      break

    default:
      newState = state
      break
  }
  if (newState !== state && type !== 'REDIRECT_VIEW' && state.redirect) {
    newState.redirect = false
  }
  return newState
}
