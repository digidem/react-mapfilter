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

export type JSONValue =
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
