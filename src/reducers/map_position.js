const mapPosition = (state = {}, action) => {
  switch (action.type) {
    case 'MOVE_MAP':
      return {...state, ...action.payload}
    default:
      return state
  }
}

module.exports = mapPosition
