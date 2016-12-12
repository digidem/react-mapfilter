const visibleFilters = (state = null, {type, payload}) => {
  switch (type) {
    case 'UPDATE_VISIBLE_FILTERS':
      return payload

    default:
      return state
  }
}

module.exports = visibleFilters
