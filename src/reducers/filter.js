const filter = (state = null, action) => {
  switch (action.type) {
    case 'UPDATE_FILTER':
      return action.payload
    default:
      return state
  }
}

module.exports = filter
