const updateFilter = (filter) => {
  return {
    type: 'UPDATE_FILTER',
    payload: filter
  }
}

const moveMap = (payload) => {
  return {
    type: 'MOVE_MAP',
    payload
  }
}

module.exports = {
  updateFilter,
  moveMap
}
