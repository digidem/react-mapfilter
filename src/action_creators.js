const updateFilter = (filter) => {
  return {
    type: 'UPDATE_FILTER',
    payload: filter
  }
}

const addVisibleFilter = (filter) => {
  return {
    type: 'ADD_VISIBLE_FILTER',
    payload: filter
  }
}

const removeVisibleFilter = (filter) => {
  return {
    type: 'REMOVE_VISIBLE_FILTER',
    payload: filter
  }
}

const moveMap = (payload) => {
  return {
    type: 'MOVE_MAP',
    payload
  }
}

const replaceFeatures = (payload) => {
  return {
    type: 'REPLACE_FEATURES',
    payload
  }
}

const addFeatures = (payload) => {
  return {
    type: 'ADD_FEATURES',
    payload: Array.isArray(payload) ? payload : [payload]
  }
}

module.exports = {
  updateFilter,
  addVisibleFilter,
  removeVisibleFilter,
  moveMap,
  replaceFeatures,
  addFeatures
}
