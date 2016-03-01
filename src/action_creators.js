const updateFilter = (filter) => {
  return {
    type: 'UPDATE_FILTER',
    payload: filter
  }
}

module.exports = {
  updateFilter
}
