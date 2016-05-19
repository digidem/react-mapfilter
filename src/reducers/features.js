const markers = require('../../test/fixtures/markers.json').features

const features = (state = markers, action) => {
  switch (action.type) {
    case 'ADD_FEATURE':
      return [...state, action.payload]
  }
  return state
}

module.exports = features
