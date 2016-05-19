const filters = (state = {}, {type, payload = {}}) => {
  const {key, exp, val} = payload
  switch (type) {
    case 'UPDATE_FILTER':
      const filter = Object.assign({}, state[key], {
        [exp]: val
      })
      return Object.assign({}, state, {
        [key]: filter
      })
    default:
      return state
  }
}

module.exports = filters
