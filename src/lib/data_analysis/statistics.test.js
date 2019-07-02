import test from 'tape'
import fs from 'fs'
import fixture from '../../../fixtures/example_fc.json'
import createMemoizedStats, { diffArrays, statReduce } from './statistics'

test('diffArrays: added and removed', function(t) {
  const A = {}
  const B = {}
  const C = {}
  const D = {}
  const oldArray = [A, B]
  const newArray = [B, C, D]
  t.deepEqual(diffArrays(oldArray, newArray), { removed: [A], added: [C, D] })
  t.end()
})

test('diffArrays: same', function(t) {
  const A = {}
  const B = {}
  const oldArray = [A, B]
  const newArray = [A, B]
  t.deepEqual(diffArrays(oldArray, newArray), { removed: [], added: [] })
  t.end()
})

test('diffArrays: only added', function(t) {
  const A = {}
  const B = {}
  const C = {}
  const D = {}
  const oldArray = [A, B]
  const newArray = [A, B, C, D]
  t.deepEqual(diffArrays(oldArray, newArray), { removed: [], added: [C, D] })
  t.end()
})

test('diffArrays: only removed', function(t) {
  const A = {}
  const B = {}
  const C = {}
  const oldArray = [A, B, C]
  const newArray = [A, B]
  t.deepEqual(diffArrays(oldArray, newArray), { removed: [C], added: [] })
  t.end()
})

test('diffArrays: completely different', function(t) {
  const A = {}
  const B = {}
  const C = {}
  const D = {}
  const oldArray = [A, B]
  const newArray = [C, D]
  t.deepEqual(diffArrays(oldArray, newArray), {
    removed: [A, B],
    added: [C, D]
  })
  t.end()
})

test('statReduce basic', t => {
  const initialStats = {
    min: 9,
    max: 12,
    mean: 10.5,
    variance: 2.25
  }
  const newStats = statReduce(initialStats, 15, 2)
  t.deepEqual(
    newStats,
    { min: 9, max: 15, mean: 12, variance: 6 },
    'stats match'
  )
  t.end()
})

test('statReduce 11th value', t => {
  const initialStats = {
    min: 2,
    max: 16,
    mean: 11,
    variance: 20.2
  }
  const newStats = statReduce(initialStats, 18, 10)
  // calculations of correct values from Excel, using population variance
  t.equal(newStats.min, 2, 'min correct')
  t.equal(newStats.max, 18, 'max correct')
  t.equal(newStats.variance.toFixed(8), '22.41322314', 'variance correct')
  t.equal(newStats.mean.toFixed(8), '11.63636364', 'mean correct')
  t.end()
})

test('statReduce date', t => {
  const initialStats = {
    min: +new Date(2019, 0, 1),
    max: +new Date(2019, 5, 1),
    mean: 1552822200000,
    variance: 42528657960000000000
  }
  const newStats = statReduce(initialStats, new Date(2019, 5, 15), 2)
  t.deepEqual(
    newStats,
    {
      min: +new Date(2019, 0, 1),
      max: +new Date(2019, 5, 15),
      mean: 1555399200000,
      variance: 41634296640000000000
    },
    'stats match'
  )
  t.end()
})

test('field stats', t => {
  const dataFixture = fixture.features.slice(0, 10).map(i => i.properties)
  const getStats = createMemoizedStats()
  const stats = getStats(dataFixture)
  const expected = require('../../../fixtures/stats.json')
  // fs.writeFileSync('./actual-stats.json', JSON.stringify(stats, null, 2))
  // JSON stringify -> parse to just skip the values Maps (not saved in fixture)
  t.deepEqual(JSON.parse(JSON.stringify(stats)), expected)
  t.end()
})

test('field stats updated', t => {
  const dataFixture = fixture.features.slice(0, 10).map(i => i.properties)
  const getStats = createMemoizedStats()
  const stats = getStats(dataFixture)
  const updatedStats = getStats(
    dataFixture.concat([
      {
        number: 7
      }
    ])
  )
  const expected = require('../../../fixtures/stats.json')
  const key = JSON.stringify(['number'])
  const updatedExpected = {
    ...expected,
    [key]: {
      ...expected[key],
      number: {
        count: 10,
        min: 1,
        max: 7,
        values: {},
        variance: 2.09,
        mean: 4.9
      }
    }
  }
  // JSON stringify -> parse to just skip the values Maps (not saved in fixture)
  t.deepEqual(JSON.parse(JSON.stringify(stats)), expected)
  t.deepEqual(JSON.parse(JSON.stringify(updatedStats)), updatedExpected)
  t.end()
})
