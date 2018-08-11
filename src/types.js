// @flow
import * as FIELD_TYPES from './constants/field_types'

import type {
  // FeatureCollectionTemplate,
  FeatureTemplate,
  Point
} from 'flow-geojson'

export type PointFeature = FeatureTemplate<Point | null> & {
  id?: string | number
}

export type PointFeatureWithId = FeatureTemplate<Point | null> & {
  id: string | number
}

// export type FeatureCollection = FeatureCollectionTemplate<PointFeature>

export type PaperSize = 'a4' | 'letter'

export type FieldState = { [fieldkey: string]: 'hidden' | 'visible' }

export type Filter = Array<string | Array<Filter>>

export type FieldTypes = { [fieldkey: string]: $Values<typeof FIELD_TYPES> }

export type FieldOrder = { [fieldkey: string]: number }
