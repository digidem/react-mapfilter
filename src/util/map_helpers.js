const extent = require('turf-extent')

/**
 * @private
 * For a given geojson FeatureCollection, return the geographic bounds.
 * For a missing or invalid FeatureCollection, return the bounds for
 * the whole world.
 * @param {object} fc Geojson FeatureCollection
 * @return {array} Bounds in format `[minLng, minLat, maxLng, maxLat]``
 */
function getBoundsOrWorld (fc) {
  // If we don't have data, default to the extent of the whole world
  // NB. Web mercator goes to infinity at lat 90! Use lat 85.
  if (!fc || !fc.features || !fc.features.length) {
    return [-180, -85, 180, 85]
  }
  return extent(fc)
}

/**
 * @private
 * Lints the features GeoJSON and checks if a valid FeatureCollection, single point feature,
 * or multipoint feature. If not, returns an empty FeatureCollection
 * @param {object} features Feature GeoJSON to lint
 * @return {object} No-op if valid GeoJSON, returns empty FC if not valid.
 */
// // TODO: Currently only supporting point features, need to support lines and polygons
// function lintFeatures (features) {
//   const errors = lintGeoJson(features)
//   if (errors.length) {
//     console.warn('features property is invalid GeoJSON\n', errors)
//     return emptyFeatureCollection
//   }
//   const isFeatureCollection = (features.type.toLowerCase() === 'featurecollection')
//   const isPointFeature = (features.type.toLowerCase() === 'feature' && features.geometry.type.toLowerCase === 'point')
//   const isMultiPointFeature = (features.type.toLowerCase() === 'feature' && features.geometry.type.toLowerCase === 'multipoint')
//   if (isFeatureCollection || isPointFeature || isMultiPointFeature) {
//     return features
//   }
//   console.warn('features must be a FeatureCollection, Point or MultiPoint feature')
//   return emptyFeatureCollection
// }

module.exports = {
  getBoundsOrWorld
}
