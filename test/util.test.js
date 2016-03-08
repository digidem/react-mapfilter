var test = require('prova')
var fs = require('fs')
var path = require('path')
var { analyzeFields,
      buildFilter,
      mergeFilterFields,
      getFiltersByField,
      parseDate} = require('../src/util/filter_helpers')

function reviver (k, v) {
  if (k === '') return v
  return parseDate(v) || v
}

// TODO: Need better tests here.
test('analyzeFields', function (t) {
  var markers = require('./fixtures/markers.json')
  var expected = fs.readFileSync(path.join(__dirname, 'fixtures/expectedFieldAnalysis.json'), 'utf8')
  expected = JSON.parse(expected, reviver)
  t.deepEqual(analyzeFields(markers), expected, 'Matches expected output')
  t.end()
})

test('mergeFilterFields', function (t) {
  var merged

  merged = mergeFilterFields(['in', 'myField', 'foo'])
  t.deepEqual(merged, ['myField'], 'works with undefined `filterFields`')

  merged = mergeFilterFields(undefined, ['myField'])
  t.deepEqual(merged, ['myField'], 'works with undefined filter')

  merged = mergeFilterFields(null, ['myField'])
  t.deepEqual(merged, ['myField'], 'works with null filter')

  merged = mergeFilterFields(['in', 'myField', 'foo'], ['myField', 'otherField'])
  t.deepEqual(merged, ['myField', 'otherField'], 'merges overlapping filters and fields')

  merged = mergeFilterFields(['in', 'myField', 'foo'], ['otherField1', 'otherField2'])
  t.deepEqual(merged, ['otherField1', 'otherField2', 'myField'], 'merges non-overlapping filters and fields')

  merged = mergeFilterFields(['all', ['in', 'myField1', 'foo'], ['in', 'myField2', 'bar']], ['otherField'])
  t.deepEqual(merged, ['otherField', 'myField1', 'myField2'], 'works with \'all\' filter')

  t.end()
})

// test('isSupportedFilter', function (t) {
//   t.true(isSupportedFilter(['in', 'foo', 'bar'], ['in']), 'if filter expression is in supported array, returns true')
//   t.false(isSupportedFilter(['in', 'foo', 'bar'], ['==']), 'returns false if filter expression not in supported list')
//   t.true(isSupportedFilter(['all', ['in', 'foo', 'bar'], ['==', 'foo', 'bar']], ['in', 'all', '==']), 'works with nested \'all\' filters')
//   t.false(isSupportedFilter(['all', ['in', 'foo', 'bar'], ['==', 'foo', 'bar']], ['in', '==']), 'works with nested \'all\' filters')
//   t.false(isSupportedFilter(['all', ['in', 'foo', 'bar'], ['==', 'foo', 'bar']], ['all', '==']), 'works with nested \'all\' filters')
//   t.end()
// })

test('getFiltersByField', function (t) {
  t.deepEqual(getFiltersByField(undefined), {}, 'undefined filter returns no filter')
  t.deepEqual(getFiltersByField(null), {}, 'null filter returns no filter')
  t.deepEqual(getFiltersByField(['in', 'foo', 'bar', 'baz']), {foo: {in: ['bar', 'baz']}})
  t.deepEqual(getFiltersByField(['<=', 'foo', 3]), {foo: {'<=': 3}})
  t.deepEqual(getFiltersByField(['>=', 'foo', 1]), {foo: {'>=': 1}})
  t.deepEqual(getFiltersByField(['all', ['<=', 'foo', 3], ['>=', 'foo', 1]]), {foo: {'>=': 1, '<=': 3}})
  t.deepEqual(getFiltersByField(['all', ['in', 'foo', 'bar'], ['in', 'baz', 'qux']]), {foo: {in: ['bar']}, baz: {in: ['qux']}})
  t.deepEqual(getFiltersByField(['all',
    ['all', ['in', 'foo', 'bar'], ['in', 'baz', 'qux']],
    ['all', ['<=', 'quux', 3], ['>=', 'quux', 1]]]), {foo: {in: ['bar']}, baz: {in: ['qux']}, quux: {'>=': 1, '<=': 3}}, 'compound-compound filter')
  t.deepEqual(getFiltersByField(['all', ['all', ['<=', 'foo', 3]]]), {foo: {'<=': 3}})
  t.deepEqual(getFiltersByField(['all', ['all', ['<=', 'foo', 3], ['>=', 'foo', 1]]]), {foo: {'>=': 1, '<=': 3}})
  t.throws(getFiltersByField.bind(null, ['==', 'foo', 'bar']), 'invalid operator')
  // Does not currently throw, instead ignores field filter on 'foo'
  // t.throws(getFiltersByField.bind(null, ['all', ['in', 'foo', 'bar'], ['in', 'foo', 'baz']]), 'repeat filter on same field within "all" compound filter')
  // t.throws(getFiltersByField.bind(null, ['all', ['in', 'foo', 'bar'], ['in', 'qux', 'baz'], ['in', 'foo', 'baz']]), 'repeat filter on same field within "all" compound filter')
  t.end()
})

test('buildFilter', function (t) {
  t.deepEqual(buildFilter({foo: {in: ['bar', 'baz']}}), ['all', ['in', 'foo', 'bar', 'baz']])
  t.deepEqual(buildFilter({foo: {'<=': 3}}), ['all', ['all', ['<=', 'foo', 3]]])
  t.deepEqual(buildFilter({foo: {'>=': 1}}), ['all', ['all', ['>=', 'foo', 1]]])
  t.deepEqual(buildFilter({foo: {'>=': 1, '<=': 3}}), ['all', ['all', ['<=', 'foo', 3], ['>=', 'foo', 1]]])
  t.deepEqual(buildFilter({foo: {in: ['bar']}, baz: {in: ['qux']}}), ['all', ['in', 'foo', 'bar'], ['in', 'baz', 'qux']])
  t.end()
})

