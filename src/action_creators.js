const updateFilter = (filter) => {
  return {
    type: 'UPDATE_FILTER',
    payload: filter
  }
}

const removeFilter = (filter) => {
  return {
    type: 'REMOVE_FILTER',
    payload: filter
  }
}

const updateVisibleFilters = (payload) => {
  return {
    type: 'UPDATE_VISIBLE_FILTERS',
    payload
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

const replaceMapStyle = (payload) => {
  return {
    type: 'REPLACE_MAP_STYLE',
    payload
  }
}

const openSettings = (payload) => {
  return {
    type: 'OPEN_SETTINGS',
    payload
  }
}

const closeModal = () => {
  return {
    type: 'CLOSE_MODAL'
  }
}

module.exports = {
  updateFilter,
  removeFilter,
  updateVisibleFilters,
  moveMap,
  replaceFeatures,
  addFeatures,
  replaceMapStyle,
  openSettings,
  closeModal
}
