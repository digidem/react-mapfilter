import PropTypes from 'prop-types'

import {
  FORMATS_UTM,
  FORMATS_DEC_DEG,
  FORMATS_DEG_MIN_SEC
} from '../constants'

// GeoJSON passed to the map view must be a FeatureCollection
// of point features.
// We need to ensure each feature has an id so we can handle
// callbacks for when a marker is clicked or hovered.
export const mapViewFeature = PropTypes.shape({
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  type: PropTypes.oneOf(['Feature']),
  geometry: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.shape({
      type: PropTypes.oneOf(['Point']).isRequired,
      coordinates: PropTypes.array.isRequired
    })
  ])
})

export const colorIndex = PropTypes.objectOf(PropTypes.string)

export const settings = PropTypes.shape({
  coordFormat: PropTypes.oneOf([FORMATS_UTM, FORMATS_DEC_DEG, FORMATS_DEG_MIN_SEC])
})

export const paperSize = PropTypes.oneOf(['a4', 'letter'])

export const fieldMapping = PropTypes.shape({
  media: PropTypes.string,
  mediaType: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string
})

/* See https://www.mapbox.com/mapbox-gl-style-spec/#types-filter */
/* We only support a specific subset of the mapbox array spec */
export const mapboxFilter = PropTypes.arrayOf(
  PropTypes.oneOfType([
    PropTypes.oneOf(['all']),
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.array,
        PropTypes.bool
      ])
    )
  ])
)

export const feature = PropTypes.shape({
  type: PropTypes.oneOf(['Feature']).isRequired,
  geometry: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.shape({
      type: PropTypes.oneOf(['Point']).isRequired,
      coordinates: PropTypes.array.isRequired
    })
  ]),
  properties: PropTypes.object
})

export const features = PropTypes.arrayOf(feature)

const fieldAnalysisField = PropTypes.shape({
  fieldname: PropTypes.string,
  count: PropTypes.number,
  filterType: PropTypes.string,
  isUnique: PropTypes.bool,
  type: PropTypes.string
})

export const fieldAnalysis = PropTypes.shape({
  $id: fieldAnalysisField,
  $type: fieldAnalysisField,
  properties: PropTypes.objectOf(fieldAnalysisField).isRequired
})

/**
 * Our filter structure is similar to mapbox filters but we index
 * by key and then expression. We only allow filters to combined
 * with logical AND using the "all" expression.
 * @example
 * ```
 * var filter = {
 *   name: {
 *     'in': ['bob', 'susan']
 *   },
 *   age: {
 *     '<=': 50,
 *     '>=': 30
 *   }
 * }
 */
export const filters = PropTypes.objectOf(
  PropTypes.objectOf(
    PropTypes.arrayOf(PropTypes.string)
  )
)
