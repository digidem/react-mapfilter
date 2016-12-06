const flat = require('flat')
const { createSelector } = require('reselect')
const randomBytes = require('randombytes')

const getFieldAnalysis = require('./field_analysis')
const getIdFieldNames = require('./id_fields')

function uniqueId () {
  return randomBytes(8).toString('hex')
}

const getFlattenedFeatures = createSelector(
  (state) => state.features,
  getFieldAnalysis,
  getIdFieldNames,
  (state, opts) => opts,
  (features, fieldAnalysis, idFieldNames, opts) => features.map(f => {
    const properties = flat(f.properties, opts)
    // We use an existing id feature property, if it is unique across all features,
    // or we use any unique id field we find under properties, or, failing that,
    // we generate a unique id.
    const id = fieldAnalysis.__validGeoJsonIdField ? f.id
      : properties[idFieldNames[0]] || uniqueId()
    return Object.assign({}, f, {id, properties})
  })
)

module.exports = getFlattenedFeatures
