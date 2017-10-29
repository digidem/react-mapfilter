import assign from 'object-assign'

const viewStates = (state = {}, {type, payload}) => {
  if (!payload) return state
  if (!payload.id) return state
  if (!payload.state) return state
  switch (type) {
    case 'UPDATE_VIEW_STATE':
      return assign({}, state, {
        [payload.id]: assign({}, state[payload.id], payload.state)
      })

    default:
      return state
  }
}

export default viewStates
