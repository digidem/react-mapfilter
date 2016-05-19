const flat = require('flat')
const { createSelector } = require('reselect')

const getFlattenedFeatures = createSelector(
  (state) => state.features,
  (features) => features.map(f => {
    return Object.assign({}, f, {
      properties: flat(f.properties)
    })
  })
)

module.exports = getFlattenedFeatures
