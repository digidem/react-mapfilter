const mapPosition = (state = {center: undefined, zoom: undefined}, action) => {
  switch (action.type) {
    case 'MOVE_MAP':
      return {...state, center: action.payload}
    case 'ZOOM_MAP':
      return {...state, zoom: action.payload}
    default:
      return state
  }
}

module.exports = mapPosition
