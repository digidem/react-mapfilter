# Mapeo View Components

These components are designed for viewing data in Mapeo. They share a common interface:

### Common Props

| Name                | Type                                                                                           | Default | Description                                                                                                                                                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| observations        | [`Observation[]`](https://github.com/digidem/mapeo-schema/blob/master/schema/observation.json) | `[]`    | Array of Mapeo observations                                                                                                                                                                                                   |
| onUpdateObservation | `func`                                                                                         |         | Callback fired when an observation has been updatedby the view. <br /> <br /> **Signature:** <br /> `(observation: Observation) => void` _`observation:`_ The updated observation                                             |
| presets             | [`Preset[]`](https://github.com/digidem/mapeo-schema/blob/master/schema/preset.json)           | `[]`    | Array of Mapeo [`Preset`](https://github.com/digidem/mapeo-schema/blob/master/schema/preset.json)s with an array of [`Field`](https://github.com/digidem/mapeo-schema/blob/master/schema/field.json)s instead of Field `id`s. |
| filter              | `array`                                                                                        |         | [Filter expression](https://github.com/digidem/mapeo-entity-filter#filter-expression-language) used to filter the observations that will be shown.                                                                            |
| getMediaUrl         | `func`                                                                                         |         | Function called with an `id` of an image attachment and a `size`, should return a valid URL to the image. <br /> <br /> **Signature:** <br /> `(id: string, size: 'thumbnail' | 'preview' | 'original') => string`            |
| getIconUrl          | `func`                                                                                         |         | Function called with an `id` of an icon, should return a valid URL to the icon.<br /> <br /> **Signature:** <br /> `(id: string) => string`                                                                                   |

## Contents

- [`<MapView />`](#mapview-)
  - [MapView Props](#mapview-props)
- [`<MediaView />`](#mediaview-)
  - [MediaView Props](#mediaview-props)
- [`<ReportView />`](#reportview-)
  - [ReportView Props](#reportview-props)

## `<MapView />`

Displays observations on a map.

### MapView Props

| Name               | Type     | Default                                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------ | -------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| onMapMove          | `func`   |                                         | Called with [CameraOptions](https://docs.mapbox.com/mapbox-gl-js/api/#cameraoptions) with properties `center`, `zoom`, `bearing`, `pitch` whenever the map is moved                                                                                                                                                                                                                                                                                                  |
| initialMapPosition | `object` |                                         | Initial [`CameraOptions`](https://docs.mapbox.com/mapbox-gl-js/api/#cameraoptions) position for map - an object with properties `center`, `zoom`, `bearing`, `pitch`. If this is not set then the map will by default zoom to the bounds of the observations. If you are going to unmount and re-mount this component (e.g. within tabs) then you will want to use onMove to store the position in state, and pass it as initialPosition for when the map re-mounts. |
| mapStyle           | `string` | `'mapbox://styles/mapbox/outdoors-v10'` | A [Mapbox Style URL](https://docs.mapbox.com/help/glossary/style-url/)                                                                                                                                                                                                                                                                                                                                                                                               |
| mapboxAccessToken  | `string` |                                         | A [Mapbox Access Token](https://docs.mapbox.com/help/glossary/access-token/) used to access the style                                                                                                                                                                                                                                                                                                                                                                |

### MapView instance methods

#### `flyTo({center, zoom}, eventData?)`

Changes any combination of center, zoom, bearing, and pitch, animating the transition along a curve that evokes flight. The animation seamlessly incorporates zooming and panning to help the user maintain her bearings even after traversing a great distance, takes the same options as the
[`flyTo` method of
`mapbox-gl-js`](https://docs.mapbox.com/mapbox-gl-js/api/#map#flyto)

#### `fitBounds(bounds, options?, eventData?)`

Pans and zooms the map to contain its visible area within the specified geographical bounds. This function will also reset the map's bearing to 0 if bearing is nonzero, takes the same options as the
[`fitBounds` method of
`mapbox-gl-js`](https://docs.mapbox.com/mapbox-gl-js/api/#map#fitbounds)

## `<MediaView />`

Display a grid of all the media attachments from the observations.

### MediaView Props

MediaView does not currently have any additional props beyond the common props
above.

## `<ReportView />`

Display observations as a report that can be printed.

### ReportView Props

ReportView shares several props with [MapView](#mapview-). These props apply to
the inset map in the ReportView.

| Name               | Type     | Default                                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------ | -------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| onMapMove          | `func`   |                                         | Called with [CameraOptions](https://docs.mapbox.com/mapbox-gl-js/api/#cameraoptions) with properties `center`, `zoom`, `bearing`, `pitch` whenever the map is moved                                                                                                                                                                                                                                                                                                  |
| initialMapPosition | `object` |                                         | Initial [`CameraOptions`](https://docs.mapbox.com/mapbox-gl-js/api/#cameraoptions) position for map - an object with properties `center`, `zoom`, `bearing`, `pitch`. If this is not set then the map will by default zoom to the bounds of the observations. If you are going to unmount and re-mount this component (e.g. within tabs) then you will want to use onMove to store the position in state, and pass it as initialPosition for when the map re-mounts. |
| mapStyle           | `string` | `'mapbox://styles/mapbox/outdoors-v10'` | A [Mapbox Style URL](https://docs.mapbox.com/help/glossary/style-url/)                                                                                                                                                                                                                                                                                                                                                                                               |
| mapboxAccessToken  | `string` |                                         | A [Mapbox Access Token](https://docs.mapbox.com/help/glossary/access-token/) used to access the style                                                                                                                                                                                                                                                                                                                                                                |
