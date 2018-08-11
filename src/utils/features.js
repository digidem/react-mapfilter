// @flow
import mem from 'mem'
import QuickLRU from 'quick-lru'
import ff from 'feature-filter-geojson'

import { flatten } from './flat'
import type { PointFeature, PointFeatureWithId, Filter } from '../types'

const CACHE_SIZE = 5000

export const flattenFeature: (feature: PointFeature) => PointFeature = mem(
  f => {
    if (!f.properties) return f
    return { ...f, properties: flatten(f.properties) }
  },
  { cache: new QuickLRU({ maxSize: CACHE_SIZE }) }
)

export const addFeatureId: (
  feature: PointFeature,
  idx: number
  // $FlowFixMe
) => PointFeatureWithId = mem(
  (f, i) => {
    if (f.id !== null && f.id !== undefined) return f
    return { ...f, id: i }
  },
  {
    cache: new QuickLRU({ maxSize: CACHE_SIZE })
  }
)

export const filterFeatures: (
  features: Array<PointFeature>,
  filter: Filter
) => Array<PointFeature> = (features, filter) => features.filter(ff(filter))
