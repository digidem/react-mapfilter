// @flow
import * as valueTypes from './constants/value_types'

// import type { Properties as CSSProperties } from 'csstype'

import type {
  // FeatureCollectionTemplate,
  Bbox,
  Point2D,
  Point3D
} from 'flow-geojson'

// export type StyleProp = CSSProperties<string | number>

// Almost JSON value, but we can also have 'undefined' as a value
export type JSONValue =
  | void
  | null
  | number
  | string
  | boolean
  | JSONObject // eslint-disable-line no-use-before-define
  | JSONArray // eslint-disable-line no-use-before-define
export type JSONObject = { [key: string]: JSONValue }
type JSONArray = Array<JSONValue>
type Properties = JSONObject | null

type FlattenedProperties = {
  [key: string]: null | number | string | boolean
} | null
// type FlattenedPropertiesArray = {
//   [key: string]: null | number | string | boolean | JSONArray
// } | null

type FeatureTemplate<G, P> = {
  id?: string | number,
  type: 'Feature',
  bbox?: Bbox,
  properties: P,
  geometry: G
}

type FeatureTemplateWithId<G, Properties> = FeatureTemplate<G, Properties> & {
  id: string | number
}

export type PointFeature = FeatureTemplate<Point2D | Point3D | null, Properties>

export type PointFeatureWithId = FeatureTemplateWithId<
  Point2D | Point3D | null,
  Properties
>

export type FlattenedPointFeature = FeatureTemplate<
  Point2D | Point3D | null,
  FlattenedProperties
>

// export type FeatureCollection = FeatureCollectionTemplate<PointFeature>

export type PaperSize = 'a4' | 'letter'

// Used to store state about field visibility in views
export type FieldState = { [fieldkey: string]: 'hidden' | 'visible' }

export type Filter = Array<string | Array<Filter>>

export type ValueTypes = { [fieldkey: string]: $Values<typeof valueTypes> }

export type FieldOrder = { [fieldkey: string]: number }

export type Classes<S> = { [className: $Keys<S>]: string }

export type StringStatistic = {|
  count: number,
  lengthMin?: number,
  lengthMax?: number,
  lengthVariance?: number,
  lengthMean?: number,
  wordsMin?: number,
  wordsMax?: number,
  wordsVariance?: number,
  wordsMean?: number,
  values: Map<string, number>
|}

export type NumberStatistic = {|
  count: number,
  min?: number,
  max?: number,
  variance?: number,
  mean?: number,
  values: Map<number, number>
|}

export type NonArrayFieldStatistic = {|
  string: StringStatistic,
  boolean: {|
    count: number,
    values: Map<boolean, number>
  |},
  number: NumberStatistic,
  date: NumberStatistic,
  datetime: NumberStatistic,
  url: number,
  image: number,
  video: number,
  audio: number,
  null: number,
  undefined: number,
  location: number
|}

export type FieldStatistic = {|
  ...$Exact<NonArrayFieldStatistic>,
  array?: {|
    count: number,
    lengthMin: number,
    lengthMax: number,
    valueStats: FieldStatistic
  |}
|}

export type Statistics = { [fieldname: string]: FieldStatistic }

type MediaType =
  | typeof valueTypes.IMAGE_URL
  | typeof valueTypes.AUDIO_URL
  | typeof valueTypes.VIDEO_URL
export type MediaArray = Array<{ src: string, type: MediaType }>

export type FieldDefinition = {
  // key on Feature.properties that this field applies to
  key: string,
  // the type of the value
  valueType: $Values<typeof valueTypes>,
  // the type of field to show (defaults to a guess based on valueType)
  fieldType: string,
  // label to show for the field key (can be translated)
  label?: string,
  // whether new options may be created, or must be an option from the list
  strict?: boolean,
  // an ordered list of options to show for a select or multi-select field
  // where value is the value to be set, and label is the translation to show
  options?: Array<
    string | {| value: number | string | boolean, label: string |}
  >
}

export type Coordinates = {
  altitude?: number,
  heading?: number,
  longitude: number,
  speed?: number,
  latitude: number,
  accuracy?: number
}

export type Key = string | Array<string | number>

type BaseField = {|
  // A unique id used to reference the field from presets
  id: string,
  // They key in a tags object that this field applies to. For nested
  // properties, key can be an array e.g. for tags = { foo: { bar: 1 } } the key
  // is ['foo', 'bar']
  key: Key,
  label?: string,
  // Displayed as a placeholder or hint for the field: use for additional
  // context or example responses for the user
  placeholder?: string,
  // If a field definition contains the property "universal": true, this field will appear in the "Add Field" list for all presets
  universal?: boolean,
  // Displayed, but cannot be edited
  readonly?: boolean
|}

// type FieldType =
//   | 'text'
//   | 'number'
//   | 'select_one'
//   | 'select_multiple'
//   | 'date'
//   | 'datetime'

export type TextField = {|
  ...$Exact<BaseField>,
  type: 'text',
  appearance?: 'single' | 'multiline',
  // Spaces are replaced with underscores
  snake_case?: boolean
|}

export type LinkField = {|
  ...$Exact<BaseField>,
  type: 'link'
|}

export type NumberField = {|
  ...$Exact<BaseField>,
  type: 'number',
  min_value?: Date,
  max_value?: Date
|}

export type SelectableFieldValue = number | string | boolean | null

export type SelectOptions = Array<
  SelectableFieldValue | {| value: SelectableFieldValue, label: string |}
>

export type SelectOneField = {|
  ...$Exact<BaseField>,
  type: 'select_one',
  options: SelectOptions,
  // User can enter their own reponse if not on the list (defaults to true on
  // desktop, false on mobile)
  other?: boolean,
  // Spaces are replaced with underscores
  snake_case?: boolean
|}

export type SelectMultipleField = {|
  ...$Exact<SelectOneField>,
  type: 'select_multiple'
|}

export type DateField = {|
  ...$Exact<NumberField>,
  type: 'date'
|}

export type DateTimeField = {|
  ...$Exact<NumberField>,
  type: 'datetime'
|}

export type Field =
  | TextField
  | NumberField
  | SelectOneField
  | SelectMultipleField
  | DateField
  | DateTimeField
  | LinkField
