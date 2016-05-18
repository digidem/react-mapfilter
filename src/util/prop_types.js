const {PropTypes} = require('react')

// GeoJSON passed to the map view must be a FeatureCollection
// of point features with specific properties used for the popup
// and marker coloring.
// We need to ensure each feature has an id so we can handle
// callbacks for when a marker is clicked or hovered.
const mapViewFeature = PropTypes.shape({
  type: PropTypes.oneOf(['Feature']),
  geometry: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.shape({
      type: PropTypes.oneOf(['Point']).isRequired,
      coordinates: PropTypes.array.isRequired
    })
  ]).isRequired,
  properties: PropTypes.shape({
    __mf_id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    __mf_color: PropTypes.string.isRequired,
    __mf_popup_title: PropTypes.string.isRequired,
    __mf_popup_subtitle: PropTypes.string,
    __mf_popup_img: PropTypes.string
  }).isRequired
})

const popupFields = PropTypes.shape({
  img: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string
})

/* See https://www.mapbox.com/mapbox-gl-style-spec/#types-filter */
/* We only support a specific subset of the mapbox array spec */
const filter = PropTypes.arrayOf(
  PropTypes.oneOfType([
    PropTypes.oneOf(['all']),
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.oneOf(['in']),
        PropTypes.array
      ])
    )
  ])
)

module.exports = {
  mapViewFeature,
  popupFields,
  filter
}
