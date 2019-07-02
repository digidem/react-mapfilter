import test from 'tape'
import { get, set } from './get_set'

test('get', t => {
  const fixture1 = { foo: { bar: 1 } }
  t.is(get(fixture1), fixture1)
  fixture1[''] = 'foo'
  t.is(get(fixture1, ['']), 'foo')
  t.is(get(fixture1, ['foo']), fixture1.foo)
  t.is(get(fixture1, 'foo'), fixture1.foo)
  t.is(get({ foo: 1 }, ['foo']), 1)
  t.is(get({ foo: null }, ['foo']), null)
  t.is(get({ foo: undefined }, ['foo']), undefined)
  t.is(get({ foo: { bar: true } }, ['foo', 'bar']), true)
  t.is(get({ foo: { bar: { baz: true } } }, ['foo', 'bar', 'baz']), true)
  t.is(get({ foo: { bar: { baz: null } } }, ['foo', 'bar', 'baz']), null)
  t.is(get({ foo: { bar: 'a' } }, ['foo', 'fake']), undefined)
  t.is(get({ foo: { bar: 'a' } }, ['foo', 'fake', 'fake2']), undefined)
  t.is(
    get({ foo: { bar: 'a' } }, ['foo', 'fake', 'fake2'], 'some value'),
    'some value'
  )
  t.is(get({ '\\': true }, ['\\']), true)
  t.is(get({ '\\foo': true }, ['\\foo']), true)
  t.is(get({ 'bar\\': true }, ['bar\\']), true)
  t.is(get({ 'foo\\bar': true }, ['foo\\bar']), true)
  t.is(get({ foo: 1 }, ['foo', 'bar']), undefined)

  const fixture2 = {}
  Object.defineProperty(fixture2, 'foo', {
    value: 'bar',
    enumerable: false
  })
  t.is(get(fixture2, ['foo']), undefined)
  t.is(get({}, ['hasOwnProperty']), undefined)

  function fn() {}
  fn.foo = { bar: 1 }
  t.is(get(fn), fn)
  t.is(get(fn, ['foo']), fn.foo)
  t.is(get(fn, ['foo', 'bar']), 1)

  const f3 = { foo: null }
  t.is(get(f3, ['foo', 'bar']), undefined)
  t.is(get(f3, ['foo', 'bar'], 'some value'), 'some value')

  t.is(get({ 'foo.baz': { bar: true } }, ['foo.baz', 'bar']), true)
  t.is(get({ 'fo.ob.az': { bar: true } }, ['fo.ob.az', 'bar']), true)

  t.is(get(null, ['foo', 'bar'], false), false)
  t.is(get('foo', ['foo', 'bar'], false), false)
  t.is(get([], ['foo', 'bar'], false), false)
  t.is(get(undefined, ['foo', 'bar'], false), false)

  t.is(get({ foo: { bar: 'qux' } }, ['foo', 'bar']), 'qux')
  t.is(get({ foo: { bar: ['qux'] } }, ['foo', 'bar', 0]), 'qux')
  t.is(get({ foo: { bar: ['qux'] } }, ['foo', 'bar', 2]), undefined)
  t.is(get({ foo: { 'bar.qux': 'hello' } }, ['foo', 'bar.qux']), 'hello')

  const nestedArr = ['baz', 'qux']
  t.is(get({ foo: { bar: nestedArr } }, ['foo', 'bar']), nestedArr)
  const nestedObj = { baz: true }
  t.is(get({ foo: { bar: nestedObj } }, ['foo', 'bar']), nestedObj)

  t.end()
})

test('set', t => {
  const fixture1 = { foo: { bar: 1 } }
  t.deepEqual(set(fixture1, ['foo', 'bar'], 2), { foo: { bar: 2 } })
  t.deepEqual(set(fixture1, 'quz', 2), { foo: { bar: 1 }, quz: 2 })
  t.deepEqual(set(fixture1, ['foo', 'bar', 0], 2), { foo: { bar: [2] } })
  t.deepEqual(set(fixture1, ['foo', 'baz', 0], 'qux'), {
    foo: { bar: 1, baz: ['qux'] }
  })
  t.end()
})
