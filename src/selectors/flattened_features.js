import { createSelector } from 'reselect'
import flattenObject from 'flat'
import flattenGeom from 'geojson-flatten'
import assign from 'object-assign'

import {FIELD_TYPE_SPACE_DELIMITED} from '../constants'

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
  state => state.fieldTypes,
  (features, fieldTypes) => {
    var withFlattenedProps
    var withFlattenedGeom
    var geomType
    const flattenedFeatures = []
    for (var i = 0; i < features.length; i++) {
      withFlattenedProps = assign({}, features[i], {
        // Does not flatten arrays - we need to preserve them for field analysis
        properties: flattenObject(features[i].properties, {safe: true})
      })
      expandDelimitedFields(withFlattenedProps.properties, fieldTypes)
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

// **Side effects**
function expandDelimitedFields (props, fieldTypes) {
  for (var key in props) {
    if (fieldTypes[key] !== FIELD_TYPE_SPACE_DELIMITED) continue
    if (typeof props[key] !== 'string') continue
    props[key] = props[key].split(' ')
  }
}

export default getFlattenedFeatures
