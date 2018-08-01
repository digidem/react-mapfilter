// @flow

import type {
  FeatureCollectionTemplate,
  FeatureTemplate,
  Point
} from 'flow-geojson'

export type Feature = FeatureTemplate<Point> & { id: string }

export type FeatureCollection = FeatureCollectionTemplate<Feature>
