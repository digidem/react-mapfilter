import fixture from '../../../fixtures/example_fc.json'
import createMemoizedStats, { diffArrays, statReduce } from './statistics'

test('diffArrays: added and removed', function() {
  const A = {}
  const B = {}
  const C = {}
  const D = {}
  const oldArray = [A, B]
  const newArray = [B, C, D]
  expect(diffArrays(oldArray, newArray)).toEqual({
    removed: [A],
    added: [C, D]
  })
})

test('diffArrays: same', function() {
  const A = {}
  const B = {}
  const oldArray = [A, B]
  const newArray = [A, B]
  expect(diffArrays(oldArray, newArray)).toEqual({ removed: [], added: [] })
})

test('diffArrays: only added', function() {
  const A = {}
  const B = {}
  const C = {}
  const D = {}
  const oldArray = [A, B]
  const newArray = [A, B, C, D]
  expect(diffArrays(oldArray, newArray)).toEqual({ removed: [], added: [C, D] })
})

test('diffArrays: only removed', function() {
  const A = {}
  const B = {}
  const C = {}
  const oldArray = [A, B, C]
  const newArray = [A, B]
  expect(diffArrays(oldArray, newArray)).toEqual({ removed: [C], added: [] })
})

test('diffArrays: completely different', function() {
  const A = {}
  const B = {}
  const C = {}
  const D = {}
  const oldArray = [A, B]
  const newArray = [C, D]
  expect(diffArrays(oldArray, newArray)).toEqual({
    removed: [A, B],
    added: [C, D]
  })
})

test('statReduce basic', () => {
  const initialStats = {
    min: 9,
    max: 12,
    mean: 10.5,
    variance: 2.25
  }
  const newStats = statReduce(initialStats, 15, 2)
  expect(newStats).toEqual({ min: 9, max: 15, mean: 12, variance: 6 })
})

test('statReduce 11th value', () => {
  const initialStats = {
    min: 2,
    max: 16,
    mean: 11,
    variance: 20.2
  }
  const newStats = statReduce(initialStats, 18, 10)
  // calculations of correct values from Excel, using population variance
  expect(newStats.min).toBe(2)
  expect(newStats.max).toBe(18)
  expect(newStats.variance.toFixed(8)).toBe('22.41322314')
  expect(newStats.mean.toFixed(8)).toBe('11.63636364')
})

test('statReduce date', () => {
  const initialStats = {
    min: +new Date(2019, 0, 1),
    max: +new Date(2019, 5, 1),
    mean: 1552822200000,
    variance: 42528657960000000000
  }
  const newStats = statReduce(initialStats, new Date(2019, 5, 15), 2)
  expect(newStats).toEqual({
    min: +new Date(2019, 0, 1),
    max: +new Date(2019, 5, 15),
    mean: 1555399200000,
    variance: 41634296640000000000
  })
})

test('field stats', () => {
  const dataFixture = fixture.features.slice(0, 10).map(i => i.properties)
  const getStats = createMemoizedStats()
  const stats = getStats(dataFixture)
  const expected = require('../../../fixtures/stats.json')
  // fs.writeFileSync('./actual-stats.json', JSON.stringify(stats, null, 2))
  // JSON stringify -> parse to just skip the values Maps (not saved in fixture)
  expect(JSON.parse(JSON.stringify(stats))).toEqual(expected)
})

test('field stats updated', () => {
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
  expect(JSON.parse(JSON.stringify(stats))).toEqual(expected)
  expect(JSON.parse(JSON.stringify(updatedStats))).toEqual(updatedExpected)
})
