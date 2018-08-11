// @flow
import test from 'tape'

import { flattenFeature, addFeatureId } from './features'
import type { PointFeature } from '../types'

test('addFeatureId', function(t) {
  const featureNoId: PointFeature = {
    type: 'Feature',
    geometry: null,
    properties: null
  }
  const expected: PointFeature = {
    type: 'Feature',
    geometry: null,
    id: 1,
    properties: null
  }
  t.deepEqual(addFeatureId(featureNoId, 1), expected, 'adds missing id')
  const featureWithId = {
    type: 'Feature',
    geometry: null,
    id: '12345',
    properties: null
  }
  t.equal(
    addFeatureId(featureWithId, 1),
    featureWithId,
    "Doesn't mutate or change feature with id"
  )
  t.end()
})

test('flattenFeature', function(t) {
  const featureNullProps = {
    type: 'Feature',
    geometry: null,
    properties: null
  }
  t.equal(
    flattenFeature(featureNullProps),
    featureNullProps,
    'null props, unchanged feature'
  )
  const featureNestedProps = {
    type: 'Feature',
    geometry: null,
    properties: {
      foo: {
        bar: 1,
        qux: 2
      }
    }
  }
  t.deepEqual(
    flattenFeature(featureNestedProps),
    {
      type: 'Feature',
      geometry: null,
      properties: {
        'foo.bar': 1,
        'foo.qux': 2
      }
    },
    'flattens nested props'
  )
  t.end()
})
