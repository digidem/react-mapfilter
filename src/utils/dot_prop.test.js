// @flow
import test from 'tape'
import { get, set } from './dot_prop'

test('get array path', t => {
  t.deepEqual(get({ foo: { bar: 'qux' } }, ['foo', 'bar']), 'qux')
  t.deepEqual(get({ foo: { bar: ['qux'] } }, ['foo', 'bar', '0']), 'qux')
  t.deepEqual(get({ foo: { 'bar.qux': 'hello' } }, ['foo', 'bar.qux']), 'hello')
  t.end()
})

test('set array', t => {
  const obj = {}
  set(obj, 'foo.0', 'bar')
  t.deepEqual(obj, { foo: ['bar'] }, 'Creates non-existent array')
  set(obj, 'foo.1', 'qux')
  t.deepEqual(obj, { foo: ['bar', 'qux'] }, 'Adds to existing array')
  set(obj, 'qux.soz.0.boo', 'hello')
  t.deepEqual(
    obj,
    { foo: ['bar', 'qux'], qux: { soz: [{ boo: 'hello' }] } },
    'deep nested array'
  )
  t.end()
})

test('set obj', t => {
  const obj = {}
  set(obj, '0', 'bar')
  t.deepEqual(obj, { '0': 'bar' }, 'Doesnt create array at top-level')
  t.end()
})

test('set with array path', t => {
  const obj = {}
  set(obj, ['foo', 'bar'], 'hello')
  t.deepEqual(obj, { foo: { bar: 'hello' } }, 'sets nested prop')
  set(obj, ['foo', 'qux', '0'], 'world')
  t.deepEqual(
    obj,
    { foo: { bar: 'hello', qux: ['world'] } },
    'sets nested prop with array'
  )
  t.end()
})

test('set with dots in path', t => {
  const obj = {}
  set(obj, ['foo', 'bar.qux'], 'hello')
  t.deepEqual(obj, { foo: { 'bar.qux': 'hello' } }, 'sets nested prop')
  t.end()
})
