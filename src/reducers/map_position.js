import assign from 'object-assign'

const mapPosition = (state = {}, action) => {
  switch (action.type) {
    case 'MOVE_MAP':
      return assign({}, state, action.payload)
    default:
      return state
  }
}

export default mapPosition
