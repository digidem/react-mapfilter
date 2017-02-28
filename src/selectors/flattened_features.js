import { createSelector } from 'reselect'
import flattenObject from 'flat'
import flattenGeom from 'geojson-flatten'
import assign from 'object-assign'

const isMultiGeometry = {
  MultiPoint: true,
  MultiPolygon: true,
  MultiLineString: true,
  GeometryCollection: true
}

/**
 * Flatten nested props and flatten multi-geometries
 */
const getFlattenedFeatures = createSelector(
  state => state.features,
  features => {
    var withFlattenedProps
    var withFlattenedGeom
    var geomType
    const flattenedFeatures = []
    for (var i = 0; i < features.length; i++) {
      withFlattenedProps = assign(features[i], {
        // Does not flatten arrays - we need to preserve them for field analysis
        properties: flattenObject(features[i].properties, {safe: true})
      })
      geomType = features[i].geometry && features[i].geometry.type
      // geojson-flatten would (unnecessarily) clone properties of every feature,
      // even if not a multiGeometry, which would have a performance overhead.
      withFlattenedGeom = isMultiGeometry[geomType] ? flattenGeom(withFlattenedProps) : [withFlattenedProps]
      // Faster (mutates flattenedFeatures) vs. flattenedFeatues.concat() which would
      // creates new arrays which need garbage collected
      Array.prototype.push.apply(flattenedFeatures, withFlattenedGeom)
    }
    return flattenedFeatures
  }
)

export default getFlattenedFeatures
