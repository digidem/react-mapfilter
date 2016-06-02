const omit = require('lodash/omit')

const filters = (state = {}, {type, payload = {}}) => {
  const {key, exp, val} = payload
  switch (type) {
    case 'UPDATE_FILTER':
      let filter
      if (!val) {
        filter = omit(state[key], exp)
        if (!Object.keys(filter).length) {
          return omit(state, key)
        }
      } else {
        filter = Object.assign({}, state[key], {
          [exp]: val
        })
      }
      return Object.assign({}, state, {
        [key]: filter
      })
    default:
      return state
  }
}

module.exports = filters
