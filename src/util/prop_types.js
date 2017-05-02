import PropTypes from 'prop-types';

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
  ]).isRequired
})

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
      PropTypes.string
    )
  ])
)

export const features = PropTypes.arrayOf(
  PropTypes.shape({
    type: PropTypes.oneOf(['Feature']).isRequired,
    geometry: PropTypes.oneOfType([
      PropTypes.oneOf([null]),
      PropTypes.shape({
        type: PropTypes.oneOf(['Point']).isRequired,
        coordinates: PropTypes.array.isRequired
      })
    ]).isRequired,
    properties: PropTypes.object
  })
).isRequired

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
