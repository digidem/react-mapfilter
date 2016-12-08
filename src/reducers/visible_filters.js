const visibleFilters = (state = [], {type, payload}) => {
  switch (type) {
    case 'ADD_VISIBLE_FILTER':
      return [
        ...state,
        payload
      ]

    case 'REMOVE_VISIBLE_FILTER':
      const index = state.indexOf(payload)
      return [
        ...state.slice(0, index),
        ...state.slice(index + 1)
      ]

    default:
      return state
  }
}

module.exports = visibleFilters
